const { useState, useEffect, Component } = React

let headers = localStorage.getItem('headers')
if (headers === null) {
    headers = {
        'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com',
        'X-RapidAPI-Key': '6c73651023mshefc6b2687a9f85bp1c06dfjsn583821826583',
    }
    localStorage.setItem('headers', JSON.stringify(headers))
} else {
    headers = JSON.parse(headers)
}

const COIN_RANKING_API = 'https://coinranking1.p.rapidapi.com'

class Strategy {
    static instance

    static get() {
        if (!Strategy.instance) {
            Strategy.instance = new Strategy()
        }
        return Strategy.instance
    }

    calcSMA(coinData, field, window, n = Infinity) {
        const prices = coinData[field].slice()
        let index = window - 1
        const len = prices.length + 1

        const y = []
        let numberOfSMAsCalculated = 0

        while (++index < len && numberOfSMAsCalculated++ < n) {
            const windowSlice = prices.slice(index - window, index)
            const sum = windowSlice.reduce((prev, curr) => prev + curr, 0)
            y.push(sum / window)
        }

        const x = coinData['x'].slice()
        x.splice(0, window - 1)

        return { x, y, name: `sma-${field}-${window}`, mode: 'lines+markers' }
    }

    calcEMA(coinData, field, window) {
        const prices = coinData[field].slice()
        let index = window - 1
        let previousEmaIndex = 0
        const length = prices.length
        const smoothingFactor = 2 / (window + 1)

        const y = []

        const sma = this.calcSMA(coinData, field, window, 1)
        y.push(sma.y[0])

        while (++index < length) {
            const value = prices[index]
            const previousEma = y[previousEmaIndex++]
            const currentEma =
                (value - previousEma) * smoothingFactor + previousEma
            y.push(currentEma)
        }

        const x = coinData['x'].slice()
        x.splice(0, window - 1)

        return { x, y, name: `ema-${field}-${window}`, mode: 'lines+markers' }
    }

    calcWMA(coinData, field, window) {
        const prices = coinData[field].slice()

        let y = []
        for (let i = 0; i <= prices.length - window; i++) {
            let sum = 0
            for (let j = 0; j < window; j++) {
                sum += prices[i + j] * (window - j)
            }
            y[i] = sum / ((window * (window + 1)) / 2)
        }

        const x = coinData['x'].slice()
        x.splice(0, window - 1)

        return { y, x, name: `wma-${field}-${window}`, mode: 'lines+markers' }
    }

    calcSignal(shortData, longData) {
        // resize arrays to be equal length
        const { length } = longData.x
        const short = shortData.y.slice().splice(shortData.y.length - length)
        const long = longData.y.slice()

        let prevShort = short[0]
        let prevLong = long[0]
        let currShort = 0
        let currLong = 0

        // determing which line is on top, true is short is on top
        let flag = prevShort > prevLong ? true : false

        let buy = []
        let xBuy = []
        let sell = []
        let xSell = []

        for (let i = 1; i < length; i++) {
            currShort = short[i]
            currLong = long[i]

            if (currShort < currLong && flag) {
                flag = !flag
                sell.push((prevShort + prevLong) / 2)
                xSell.push(longData.x[i - 1])
            }

            if (currLong < currShort && !flag) {
                flag = !flag
                buy.push((prevShort + prevLong) / 2)
                xBuy.push(longData.x[i - 1])
            }

            prevShort = short[i]
            prevLong = long[i]
        }

        return [
            {
                x: xBuy,
                y: buy,
                mode: 'markers',
                type: 'scatter',
                name: `${shortData.name}-${longData.name}-BUY`,
            },
            {
                x: xSell,
                y: sell,
                mode: 'markers',
                type: 'scatter',
                name: `${shortData.name}-${longData.name}-SELL`,
            },
        ]
    }
}

const Graph = () => {
    // config graph form fields
    const [coins, setCoins] = useState({})
    const [coin, setCoin] = useState('Qwsogvtv82FCd')
    const [currencies, setCurrencies] = useState({})
    const [currency, setCurrency] = useState('yhjMzLPhuIDl')
    const periods = [
        'minute',
        '5minutes',
        'hour',
        '8hours',
        'day',
        'week',
        'month',
    ]
    const [period, setPeriod] = useState(periods[0])

    // data used for graph
    const [coinCurrencyPair, setCoinCurrencyPair] = useState('')
    const [coinData, setCoinData] = useState({})
    const [indicators, setIndicators] = useState([])
    const [signals, setSignals] = useState([])

    // add indicator form fields
    const strategies = [
        'Simple Moving Average',
        'Exponential Moving Average',
        'Weighted Moving Average',
    ]
    const [strategy, setStrategy] = useState(strategies[0])
    const priceTypes = ['open', 'high', 'low', 'close']
    const [priceType, setPriceType] = useState(priceTypes[0])
    const windows = Array.from({ length: 90 }, (_, i) => i + 1)
    const [window, setWindow] = useState(windows[0])

    // calc signals
    const [short, setShort] = useState('')
    const [long, setLong] = useState('')

    // get the Coin and Currency data for Graph config fields
    useEffect(() => {
        const getFieldData = async () => {
            const data = await Promise.all([
                fetch(`${COIN_RANKING_API}/coins?limit=${100}`, {
                    headers,
                })
                    .then((content) => content.json())
                    .then(({ data: { coins: content } }) => {
                        const coinsData = {}
                        content.forEach(({ uuid, name, symbol }) => {
                            coinsData[`${name}`] = { symbol, uuid }
                        })
                        return coinsData
                    }),
                fetch(
                    `${COIN_RANKING_API}/reference-currencies?limit=${100}&type=fiat`,
                    {
                        headers,
                    }
                )
                    .then((content) => content.json())
                    .then(({ data: { currencies: content } }) => {
                        const currenciesData = {}
                        content.forEach(({ uuid, name, symbol }) => {
                            currenciesData[`${name}`] = { symbol, uuid }
                        })
                        return currenciesData
                    }),
            ])

            setCoins(data[0])
            setCurrencies(data[1])
        }
        getFieldData()
    }, [])

    // load the options for the Coin and Currency data for Graph config fields
    const loadOptions = (obj, idName) =>
        Object.keys(obj).map((element) => {
            return (
                <option
                    value={obj[element]['uuid']}
                    id={`${idName}-${element.replaceAll(' ', '-')}`}
                >
                    {element}
                </option>
            )
        })

    // load the intervals field on the config graph form
    const loadListAsSelectOptions = (list, name) => {
        return list.map((element) => {
            return (
                <option value={element} id={`${name}-${element}`}>
                    {element}
                </option>
            )
        })
    }

    // short polling data
    useEffect(() => {
        if (coinCurrencyPair !== '') {
            const refetchData = async () => {
                const data = await fetch(
                    `${COIN_RANKING_API}/coin/${coin}/ohlc?referenceCurrencyUuid=${currency}&interval=${period}&limit=${100}`,
                    {
                        headers,
                    }
                )
                    .then((content) => content.json())
                    .then(({ data: { ohlc } }) => {
                        let obj = {
                            x: [],
                            close: [],
                            high: [],
                            low: [],
                            open: [],
                        }
                        ohlc.slice()
                            .reverse()
                            .forEach(
                                ({ startingAt, open, high, low, close }) => {
                                    obj.x.push(new Date(+startingAt * 1000))
                                    obj.open.push(+open)
                                    obj.high.push(+high)
                                    obj.low.push(+low)
                                    obj.close.push(+close)
                                }
                            )
                        return obj
                    })
                setCoinData(data)
            }

            const interval = setInterval(() => {
                refetchData()
            }, 60 * 1000)

            return () => clearInterval(interval)
        }
    }, [coinCurrencyPair])

    const searchName = (obj, uuid) =>
        Object.keys(obj).filter((item) => obj[item]['uuid'] === uuid)

    // re renders graph
    useEffect(() => {
        const element = document.getElementById('graph')

        const main = {
            ...coinData,
            decreasing: { line: { color: '#7F7F7F' } },
            increasing: { line: { color: '#17BECF' } },
            type: 'candlestick',
            xaxis: 'x',
            yaxis: 'y',
            name: `main`,
        }

        const calcIndicator = (element) => {
            const [strat, pType, win] = element.split('-')
            if (strat === 'sma') {
                return Strategy.get().calcSMA(coinData, pType, win)
            }

            if (strat === 'ema') {
                return Strategy.get().calcEMA(coinData, pType, win)
            }

            if (strat === 'wma') {
                return Strategy.get().calcWMA(coinData, pType, win)
            }
        }

        const indicatorsData = indicators.map((element) => {
            return calcIndicator(element)
        })

        const signalsData = signals.map((element) => {
            const [shortName, longName] = element.split('*')
            const shortData = calcIndicator(shortName)
            const longData = calcIndicator(longName)
            return Strategy.get().calcSignal(shortData, longData)
        })

        const data = [main, ...indicatorsData, ...[].concat(...signalsData)]

        Plotly.newPlot(element, data, {
            title: `${coinCurrencyPair}`,
            dragmode: 'zoom',
            xaxis: {
                title: 'Date',
                showgrid: false,
                zeroline: false,
                rangeslider: {
                    visible: false,
                },
            },
            yaxis: {
                title: `${searchName(currencies, currency)}`,
                showline: false,
            },
        })
    }, [coinData, indicators, signals])

    // request resolver
    const getCoinDataSubmit = (e) => {
        e.preventDefault()

        setCoinCurrencyPair(
            `${searchName(coins, coin)}-${searchName(currencies, currency)}`
        )

        const getHistoricData = async () => {
            const data = await fetch(
                `${COIN_RANKING_API}/coin/${coin}/ohlc?referenceCurrencyUuid=${currency}&interval=${period}&limit=${100}`,
                {
                    headers,
                }
            )
                .then((content) => content.json())
                .then(({ data: { ohlc } }) => {
                    let obj = { x: [], close: [], high: [], low: [], open: [] }
                    ohlc.slice()
                        .reverse()
                        .forEach(({ startingAt, open, high, low, close }) => {
                            obj.x.push(new Date(+startingAt * 1000))
                            obj.open.push(+open)
                            obj.high.push(+high)
                            obj.low.push(+low)
                            obj.close.push(+close)
                        })
                    return obj
                })
            setCoinData(data)
        }

        getHistoricData()
    }

    // generate indicator form handler
    const addIndicator = (e) => {
        e.preventDefault()

        const strat = strategy
            .replace(/[a-z]/g, '')
            .replaceAll(' ', '')
            .toLowerCase()

        const newIndicator = `${strat}-${priceType}-${window}`
        if (!indicators.includes(newIndicator)) {
            setIndicators([...indicators, `${strat}-${priceType}-${window}`])
        }
    }

    const handleCalculateSingal = (e) => {
        e.preventDefault()

        const shortInterval = short.split('-').at(-1)
        const longInterval = long.split('-').at(-1)
        if (+shortInterval >= +longInterval) {
            return
        }

        const newSignal = `${short}*${long}`
        if (!signals.includes(newSignal)) {
            setSignals([...signals, newSignal])
        }
    }

    const loadIndicatorsList = () => {
        return indicators.map((indicator) => {
            return (
                <div>
                    <p>
                        {indicator}
                        <button
                            type="button"
                            value={indicator}
                            onClick={(e) => {
                                setIndicators(
                                    indicators.filter(
                                        (item) => item !== e.target.value
                                    )
                                )
                            }}
                        >
                            X
                        </button>
                    </p>
                </div>
            )
        })
    }

    const loadSignalsList = () => {
        return signals.map((signal) => {
            return (
                <div>
                    <p>
                        {signal}
                        <button
                            type="button"
                            value={signal}
                            onClick={(e) => {
                                setSignals(
                                    signals.filter(
                                        (item) => item !== e.target.value
                                    )
                                )
                            }}
                        >
                            X
                        </button>
                    </p>
                </div>
            )
        })
    }

    return (
        <div>
            <h1>Coin prices</h1>
            <div id="graph"></div>
            <h4>Config Graph</h4>
            <form onSubmit={getCoinDataSubmit}>
                <label for="coins">Coin: </label>
                <select name="coins" onChange={(e) => setCoin(e.target.value)}>
                    {loadOptions(coins, 'coin')}
                </select>
                <br />
                <label for="currencies">Currency: </label>
                <select
                    name="currencies"
                    onChange={(e) => setCurrency(e.target.value)}
                >
                    {loadOptions(currencies, 'currencies')}
                </select>
                <br />
                <label for="periods">Interval: </label>
                <select
                    name="periods"
                    onChange={(e) => setPeriod(e.target.value)}
                >
                    {loadListAsSelectOptions(periods, 'periods')}
                </select>
                <br />
                <button type="submit">Get Prices</button>
            </form>

            {Object.keys(coinData).length > 0 && (
                <div>
                    <h4>Add Indicator</h4>
                    <form onSubmit={addIndicator}>
                        <label for="strategy">Strategy: </label>
                        <select
                            name="strategy"
                            onChange={(e) => setStrategy(e.target.value)}
                        >
                            {loadListAsSelectOptions(strategies, 'strategy')}
                        </select>
                        <br />
                        <label for="price-type">Price Type: </label>
                        <select
                            name="price-type"
                            onChange={(e) => setPriceType(e.target.value)}
                        >
                            {loadListAsSelectOptions(priceTypes, 'price-type')}
                        </select>
                        <br />
                        <label for="window">Window: </label>
                        <select
                            name="window"
                            onChange={(e) => setWindow(e.target.value)}
                        >
                            {loadListAsSelectOptions(windows, 'window')}
                        </select>
                        <br />
                        <button type="submit">Add Indicator</button>
                    </form>
                </div>
            )}

            {indicators.length >= 2 && (
                <div>
                    <h4>Calculate Signal</h4>
                    <form onSubmit={handleCalculateSingal}>
                        <label for="short">Short: </label>
                        <select
                            name="short"
                            onChange={(e) => setShort(e.target.value)}
                        >
                            {loadListAsSelectOptions(
                                ['---', ...indicators],
                                'short'
                            )}
                        </select>
                        <br />
                        <label for="long">Long: </label>
                        <select
                            name="long"
                            onChange={(e) => setLong(e.target.value)}
                        >
                            {loadListAsSelectOptions(
                                ['---', ...indicators],
                                'long'
                            )}
                        </select>
                        <br />
                        <button type="submit">Calculate Signal</button>
                    </form>
                </div>
            )}

            {indicators.length > 0 && (
                <div>
                    <h4>Indicator</h4>
                    {loadIndicatorsList()}
                </div>
            )}

            {signals.length > 0 && (
                <div>
                    <h4>Signals</h4>
                    {loadSignalsList()}
                </div>
            )}
        </div>
    )
}

class App extends Component {
    render() {
        return (
            <div>
                <Graph />
            </div>
        )
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)

import Head from 'next/head'
import Image from 'next/image'
import { Sora } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { useState } from 'react';
import axios from 'axios'

const sora = Sora({
  weight: '500',
  style: 'normal',
  subsets: ['latin'],
})

export default function Home() {

  const [location, setLocation] = useState("");
  const [data, setData] = useState({});
  const [weather, setWeather] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [icon, setIcon] = useState();

  var apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  var lang = "en"
  var units = "metric"
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${units}&appid=${apiKey}&lang=${lang}`;

  const searchLocation = (e) => {
    if (e.key === "Enter") {
      axios.get(url)
        .then((response) => {
          console.clear();
          setVisible(true);
          setData(response.data)
          console.log(response.data)
          setWeather(response.data.weather)
          setErrorMessage('')
          setIcon(response.data.weather[0].icon)
        }).catch(err => {
          console.log(err)
          setErrorMessage("Please enter another location")
          setData({})
          setWeather()
          setVisible(false);
        })
      setLocation('')
    }
  }

  return (
    <>
      <main className={styles.main}>
        <h1 className={sora.className}>Let's check the weather today.</h1>
        {errorMessage}
        <input className={styles.input} value={location} onChange={e => setLocation(e.target.value)}
          placeholder="Enter location"
          onKeyDown={searchLocation}
          type="text" />
        {visible ? <div className={styles.section}>
          <h2 className={sora.className}>{data.name}</h2>
          <div style={{ fontSize: 65, display: 'flex', alignItems: 'center' }} className={sora.className}>
            <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} />{data.main.temp}&deg;C
          </div>
          {weather && weather.map((w, index) => {
            return (
              <div className={styles.content} key={index}>
                <div className={sora.className}>{w.main}</div>
                <div className={sora.className}>{w.description}</div>
              </div>
            )
          })
          }
          <div className={styles.barCont}>
            <div className={styles.bar}>
              <p className={sora.className}>Feels like {data.main.feels_like}&deg;C</p>
            </div>
            <div className={styles.bar}>
              {data.wind.gust ? <div className={sora.className}>Wind gust: {data.wind.gust}m/s</div> : <div className={sora.className}>No current Wind Gust right now</div>}
            </div>
          </div>
        </div> : <></>}
      </main>
    </>
  )
}

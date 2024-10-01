import React, { useEffect, useState } from 'react'


const App = () => {

  const apiKey = import.meta.env.VITE_MY_API_KEY;

  const [userIp, setUserIp] = useState("");

  const fetchUserIp = async () => {
    try {
      
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      console.log(data.ip);
      setUserIp(data.ip)
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  useEffect(() => {
    fetchUserIp();
  }, [])


  const fetchDataByIp = async () => {
    try {
      const response = await fetch(`https://geo.ipify.org/api/v2/country?apiKey=${apiKey}&ipAddress=${userIp}`);
      const data = await response.json();

      console.log(data);
    } catch (error) {
      console.log("Error is: ", error);
    }
  }

  useEffect(() => {
    fetchDataByIp();
  }, [])


  return (
    <div className='bg-red-100'>{userIp}</div>
  )
}

export default App
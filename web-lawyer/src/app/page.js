'use client'
import React, { useEffect, useState } from 'react'
import Image from "next/image"
import styles from "./page.module.css"

export default function Home() {
  const [databases, setDatabases] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/databases')
      .then(response => response.json())
      .then(data => setDatabases(data))
  }, [])

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <h1>web-lawyer</h1>
        <h1>Databases</h1>
        <ul>
          {databases.map((db, index) => (
            <li key={index}>{db.Database}</li>
          ))}
        </ul>
      </main>
    </div>
  )
}

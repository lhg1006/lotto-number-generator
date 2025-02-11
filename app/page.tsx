"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import GoogleAdsense from '@/components/GoogleAdsense'

interface LotteryResult {
  numbers: number[]
  timestamp: string
}

export default function Home() {
  const [numbers, setNumbers] = useState<number[]>([])
  const [sortedNumbers, setSortedNumbers] = useState<number[]>([])
  const [multipleLines, setMultipleLines] = useState<number[][]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [lotteryResults, setLotteryResults] = useState<LotteryResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLotteryResults()
  }, [])

  useEffect(() => {
    setSortedNumbers([...numbers].sort((a, b) => a - b))
  }, [numbers])

  const fetchLotteryResults = async () => {
    try {
      const response = await fetch("/api/lottery-results")
      if (!response.ok) {
        throw new Error("Failed to fetch lottery results")
      }
      const data = await response.json()
      setLotteryResults(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateNumber = () => {
    if (numbers.length >= 6) {
      setNumbers([])
      setSortedNumbers([])
      setIsComplete(false)
      setIsSpinning(true)

      setTimeout(() => {
        const newNumber = Math.floor(Math.random() * 45) + 1
        setNumbers([newNumber])
        setIsSpinning(false)
      }, 1000)
      return
    }
    
    setIsSpinning(true)
    setTimeout(() => {
      let newNumber
      do {
        newNumber = Math.floor(Math.random() * 45) + 1
      } while (numbers.includes(newNumber))

      const updatedNumbers = [...numbers, newNumber]
      setNumbers(updatedNumbers)

      if (updatedNumbers.length === 6) {
        setLotteryResults(prev => [{
          numbers: [...updatedNumbers].sort((a, b) => a - b),
          timestamp: new Date().toISOString()
        }, ...prev.slice(0, 4)])
        setIsComplete(true)
      }
      setIsSpinning(false)
    }, 1000)
  }

  const generateAllNumbers = () => {
    setIsSpinning(true)

    setTimeout(() => {
      const newNumbers: number[] = []
      while (newNumbers.length < 6) {
        const newNumber = Math.floor(Math.random() * 45) + 1
        if (!newNumbers.includes(newNumber)) {
          newNumbers.push(newNumber)
        }
      }
      setNumbers(newNumbers)
      
      setLotteryResults(prev => [{
        numbers: [...newNumbers].sort((a, b) => a - b),
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 4)])
      
      setIsSpinning(false)
    }, 2000)
  }

  const generateFiveLines = () => {
    setIsSpinning(true)

    setTimeout(() => {
      const newMultipleLines: number[][] = []
      for (let i = 0; i < 5; i++) {
        const lineNumbers: number[] = []
        while (lineNumbers.length < 6) {
          const newNumber = Math.floor(Math.random() * 45) + 1
          if (!lineNumbers.includes(newNumber)) {
            lineNumbers.push(newNumber)
          }
        }
        newMultipleLines.push(lineNumbers.sort((a, b) => a - b))
      }
      setMultipleLines(newMultipleLines)
      
      const newResults = newMultipleLines.map(line => ({
        numbers: line,
        timestamp: new Date().toISOString()
      }))
      setLotteryResults(prev => [...newResults, ...prev].slice(0, 5))
      
      setIsSpinning(false)
    }, 2000)
  }

  const reset = () => {
    setNumbers([])
    setSortedNumbers([])
    setMultipleLines([])
    setIsComplete(false)
  }

  const getNumberColor = (number: string): string => {
    const num = parseInt(number)
    
    if (num <= 10) {
      return "bg-red-500 text-white"        // 1-10: 빨강
    } else if (num <= 20) {
      return "bg-orange-500 text-white"     // 11-20: 주황
    } else if (num <= 30) {
      return "bg-yellow-500 text-black"     // 21-30: 노랑
    } else if (num <= 40) {
      return "bg-blue-500 text-white"       // 31-40: 파랑
    } else {
      return "bg-green-500 text-white"      // 41-45: 초록
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-3 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 mb-6">
          로또 번호 추첨기
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="w-full">
            <div className="backdrop-blur-xl bg-white/10 p-4 md:p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 h-full">
              <div className="flex justify-center items-center relative mb-6">
                <div className={`w-28 h-28 md:w-32 md:h-32 backdrop-blur-3xl bg-gradient-to-br from-purple-400/40 to-pink-400/40 rounded-full ${
                  isSpinning ? "animate-spin" : ""
                } flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]`}>
                  <div className="text-3xl md:text-4xl font-bold text-white">
                    {numbers[numbers.length - 1] || "?"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 w-full max-w-md mx-auto place-items-center">
                {[...Array(6)].map((_, index) => (
                  <div key={index}
                    className="backdrop-blur-md bg-gradient-to-br from-purple-400/20 to-pink-400/20 text-white text-lg sm:text-xl md:text-2xl font-bold rounded-xl
                      w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center shadow-lg
                      transform hover:scale-105 transition-all duration-300 border border-white/10">
                    {numbers[index] || "?"}
                  </div>
                ))}
              </div>

              <div className="w-full max-w-sm mx-auto mb-6 p-3 sm:p-4 backdrop-blur-md bg-white/5 rounded-xl border border-white/10">
                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                  {sortedNumbers.length > 0 ? (
                    sortedNumbers.map((number, index) => (
                      <div key={index}
                        className={`${getNumberColor(number.toString())} text-base sm:text-lg
                          font-bold rounded-lg w-8 h-8 sm:w-10 sm:h-10
                          flex items-center justify-center shadow-lg backdrop-blur-sm
                          transform hover:scale-110 transition-all duration-300 hover:shadow-xl`}>
                        {number}
                      </div>
                    ))
                  ) : (
                    [...Array(6)].map((_, index) => (
                      <div key={index}
                        className="backdrop-blur-md bg-white/5 text-white/40 text-base sm:text-lg
                          font-bold rounded-lg w-8 h-8 sm:w-10 sm:h-10
                          flex items-center justify-center shadow-lg border border-white/10">
                        ?
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center w-full gap-2 sm:gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full max-w-sm">
                  <Button
                    onClick={generateNumber}
                    disabled={isSpinning}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3
                      rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg
                      text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm">
                    {isSpinning ? "추첨 중..." : "번호 뽑기"}
                  </Button>

                  <Button
                    onClick={generateAllNumbers}
                    disabled={isSpinning}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3
                      rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg
                      text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm">
                    전체 번호 뽑기
                  </Button>
                </div>

                <Button
                  onClick={generateFiveLines}
                  disabled={isSpinning}
                  className="w-full max-w-sm bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 hover:from-green-500 hover:via-emerald-600 hover:to-teal-700 text-white font-bold py-3
                    rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg
                    text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm">
                  다섯줄 뽑기
                </Button>

                <Button
                  onClick={reset}
                  variant="outline"
                  className="w-full max-w-sm backdrop-blur-md bg-white/5 text-white border border-white/20
                    hover:bg-white/10 font-bold py-3 rounded-lg transition-all duration-300
                    text-sm sm:text-base transform hover:scale-[1.02] hover:shadow-lg">
                  리셋
                </Button>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="backdrop-blur-xl bg-white/10 p-4 md:p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 h-full">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                히스토리
              </h2>
              {isLoading ? (
                <div className="flex justify-center items-center h-24 sm:h-32">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-4 border-purple-400 border-t-transparent" />
                </div>
              ) : (
                <ul className="space-y-3 sm:space-y-4">
                  {lotteryResults.map((result, index) => (
                    <li key={index}
                      className="flex flex-col items-center space-y-1.5 sm:space-y-2 p-3 sm:p-4
                        hover:bg-white/5 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/10">
                      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                        {result.numbers.map((number, idx) => (
                          <span key={idx}
                            className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center
                              justify-center font-bold text-sm sm:text-base rounded-lg
                              transform hover:scale-110 transition-all duration-300 shadow-lg
                              ${getNumberColor(number.toString())}`}>
                            {number}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm text-white/60">
                        {new Date(result.timestamp).toLocaleString('ko-KR')}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* 푸터 추가 */}
        <footer className="mt-8 text-center">
          <p className="text-sm text-white/60 font-light">
            © 2025 lhg1006. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}


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
    if (numbers.length >= 6) return
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
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white mb-6">
          로또 번호 추첨기
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-4 md:gap-8">
          <div className="hidden lg:block space-y-4 sticky top-4 self-start">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <GoogleAdsense
                client="ca-pub-XXXXXXXXXXXXXXXX"
                slot="SLOT_ID_2"
                style={{ display: 'block', minHeight: '280px' }}
                format="auto"
                responsive="true"
              />
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="lg:hidden bg-white p-4 rounded-lg shadow-md min-h-[100px] w-full">
              <GoogleAdsense
                client="ca-pub-XXXXXXXXXXXXXXXX"
                slot="SLOT_ID_1"
                style={{ minHeight: '100px' }}
                format="auto"
                responsive="true"
              />
            </div>

            <div className="bg-white p-4 md:p-8 rounded-lg shadow-md flex flex-col items-center">
              <div className="relative mb-8">
                <div className={`w-32 h-32 md:w-40 md:h-40 border-8 border-blue-500 rounded-full ${
                  isSpinning ? "animate-spin" : ""
                } flex items-center justify-center transition-all duration-300`}>
                  <div className="text-3xl md:text-4xl font-bold text-blue-700">
                    {numbers[numbers.length - 1] || "?"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 w-full max-w-md mx-auto place-items-center">
                {[...Array(6)].map((_, index) => (
                  <div key={index}
                    className="bg-yellow-400 text-blue-700 text-lg sm:text-xl md:text-2xl font-bold rounded-full 
                      w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center shadow-md 
                      transform hover:scale-105 transition-transform duration-200">
                    {numbers[index] || "?"}
                  </div>
                ))}
              </div>

              {numbers.length > 0 && (
                <div className="w-full mb-6 p-3 sm:p-4 bg-blue-100 rounded-lg">
                  <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                    {sortedNumbers.map((number, index) => (
                      <div key={index}
                        className="bg-white text-blue-700 text-base sm:text-lg md:text-xl font-bold rounded-full 
                          w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center shadow-md">
                        {number}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full max-w-md mb-4">
                <Button
                  onClick={generateNumber}
                  disabled={isComplete || isSpinning}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 
                    rounded-lg transition duration-300 ease-in-out transform hover:scale-105 
                    text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed">
                  {isComplete ? "완료" : isSpinning ? "추첨 중..." : "번호 뽑기"}
                </Button>

                <Button
                  onClick={generateAllNumbers}
                  disabled={isSpinning}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 
                    rounded-lg transition duration-300 ease-in-out transform hover:scale-105
                    text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed">
                  전체 번호 뽑기
                </Button>
              </div>

              <Button
                onClick={generateFiveLines}
                disabled={isSpinning}
                className="w-full max-w-md mb-4 bg-purple-500 hover:bg-purple-600 text-white 
                  font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition duration-300 ease-in-out 
                  text-sm sm:text-base transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                다섯줄 뽑기
              </Button>

              <Button
                onClick={reset}
                variant="outline"
                className="w-full max-w-md border-2 border-blue-500 text-blue-500 
                  hover:bg-blue-50 font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition duration-300 
                  text-sm sm:text-base ease-in-out transform hover:scale-105">
                리셋
              </Button>
            </div>

            {multipleLines.length > 0 && (
              <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md">
                <h3 className="text-lg sm:text-xl font-semibold text-purple-700 mb-3 sm:mb-4 text-center">
                  다섯줄 번호
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {multipleLines.map((line, lineIndex) => (
                    <div key={lineIndex} 
                      className="flex flex-wrap justify-center gap-1.5 sm:gap-2 p-1.5 sm:p-2">
                      {line.map((number, numberIndex) => (
                        <div key={numberIndex}
                          className="bg-white text-purple-700 text-xs sm:text-sm md:text-base 
                            font-bold rounded-full w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 
                            flex items-center justify-center shadow-md">
                          {number}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white p-3 sm:p-4 md:p-8 rounded-lg shadow-md">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-blue-700">
                내 번호 히스토리
              </h2>
              {isLoading ? (
                <div className="flex justify-center items-center h-24 sm:h-32">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500" />
                </div>
              ) : (
                <ul className="space-y-3 sm:space-y-4">
                  {lotteryResults.map((result, index) => (
                    <li key={index}
                      className="flex flex-col items-center space-y-1.5 sm:space-y-2 p-2 sm:p-3 
                        hover:bg-gray-50 rounded-lg transition-all duration-200">
                      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                        {result.numbers.map((number, idx) => (
                          <span key={idx}
                            className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center 
                              justify-center font-bold text-sm sm:text-base md:text-lg rounded-full
                              transform hover:scale-110 transition-transform duration-200
                              ${getNumberColor(number.toString())}`}>
                            {number}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm text-gray-500">
                        {new Date(result.timestamp).toLocaleString('ko-KR')}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="lg:hidden bg-white p-4 rounded-lg shadow-md">
              <GoogleAdsense
                client="ca-pub-XXXXXXXXXXXXXXXX"
                slot="SLOT_ID_3"
                style={{ display: 'block' }}
                format="auto"
                responsive="true"
              />
            </div>
          </div>

          <div className="hidden lg:block space-y-4">
            <div className="sticky top-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <GoogleAdsense
                  client="ca-pub-XXXXXXXXXXXXXXXX"
                  slot="SLOT_ID_4"
                  style={{ display: 'block', minHeight: '280px' }}
                  format="auto"
                  responsive="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


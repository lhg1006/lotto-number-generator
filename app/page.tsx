"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface LotteryResult {
  round: string
  numbers: string[]
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

      setNumbers([...numbers, newNumber])

      if (numbers.length === 5) {
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
      setIsComplete(true)
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
      setIsSpinning(false)
    }, 2000)
  }

  const reset = () => {
    setNumbers([])
    setSortedNumbers([])
    setMultipleLines([])
    setIsComplete(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">좌측 상단 광고</div>
          <h1 className="text-4xl font-bold text-center text-white mb-8 md:mb-0 flex items-center justify-center">
            로또 번호 추첨기
          </h1>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">우측 상단 광고</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
            <div className="relative mb-6">
              <div
                className={`w-40 h-40 border-8 border-blue-500 rounded-full ${isSpinning ? "animate-spin" : ""} flex items-center justify-center`}
              >
                <div className="text-4xl font-bold text-blue-700">{numbers[numbers.length - 1] || "?"}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-yellow-400 text-blue-700 text-2xl font-bold rounded-full w-20 h-20 flex items-center justify-center shadow-md"
                >
                  {numbers[index] || "?"}
                </div>
              ))}
            </div>

            {numbers.length > 0 && (
              <div className="w-full mb-6 p-4 bg-blue-100 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-700 mb-2 text-center">오름차순 정렬</h3>
                <div className="flex justify-center space-x-3">
                  {sortedNumbers.map((number, index) => (
                    <div
                      key={index}
                      className="bg-white text-blue-700 text-xl font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-md"
                    >
                      {number}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4 w-full">
              <Button
                onClick={generateNumber}
                disabled={isComplete || isSpinning}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                {isComplete ? "완료" : isSpinning ? "추첨 중..." : "번호 뽑기"}
              </Button>

              <Button
                onClick={generateAllNumbers}
                disabled={isComplete || isSpinning}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                전체 번호 뽑기
              </Button>
            </div>

            <Button
              onClick={generateFiveLines}
              disabled={isSpinning}
              className="w-full mb-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              다섯줄 뽑기
            </Button>

            <Button
              onClick={reset}
              variant="outline"
              className="w-full border-2 border-blue-500 text-blue-500 hover:bg-blue-100 font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out"
            >
              리셋
            </Button>

            {multipleLines.length > 0 && (
              <div className="w-full mt-6 p-4 bg-purple-100 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-700 mb-4 text-center">다섯줄 번호</h3>
                {multipleLines.map((line, lineIndex) => (
                  <div key={lineIndex} className="flex justify-center space-x-2 mb-2">
                    {line.map((number, numberIndex) => (
                      <div
                        key={numberIndex}
                        className="bg-white text-purple-700 text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-md"
                      >
                        {number}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md overflow-y-auto max-h-[600px]">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">최근 당첨번호</h2>
            {isLoading ? (
              <p className="text-center text-gray-600">로딩 중...</p>
            ) : (
              <ul className="space-y-6">
                {lotteryResults.map((result, index) => (
                  <li key={index} className="border-b pb-4">
                    <p className="font-semibold text-lg text-center mb-2">{result.round}</p>
                    <div className="flex justify-center space-x-3">
                      {result.numbers.map((number, idx) => (
                        <span
                          key={idx}
                          className="bg-yellow-400 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg"
                        >
                          {number}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">하단 좌측 광고</div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">하단 우측 광고</div>
        </div>
      </div>
    </div>
  )
}


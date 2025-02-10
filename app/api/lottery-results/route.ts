import { NextResponse } from "next/server"
import * as cheerio from "cheerio"

export async function GET() {
  try {
    const response = await fetch("https://www.dhlottery.co.kr/common.do?method=main")
    const html = await response.text()
    const $ = cheerio.load(html)

    const results = []
    $(".winnumber").each((index, element) => {
      const round = $(element).find("strong").text().trim()
      const numbers = $(element)
        .find("span")
        .map((_, span) => $(span).text().trim())
        .get()
      results.push({ round, numbers })
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error fetching lottery results:", error)
    return NextResponse.json({ error: "Failed to fetch lottery results" }, { status: 500 })
  }
}


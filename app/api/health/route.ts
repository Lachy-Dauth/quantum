import { NextResponse } from 'next/server'
import { db } from '@/lib/db/client'

export async function GET() {
  try {
    await db.query('SELECT 1')
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}

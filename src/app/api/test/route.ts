import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
  try {
    return NextResponse.json({ message: 'HEYYYYY' }, { status: 200 })
  } catch (err) {
    console.error(err)
  }
}

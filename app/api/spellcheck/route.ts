import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ message: 'Text is required' }, { status: 400 });
    }

    const formData = new URLSearchParams();
    formData.append('text1', text);

    // Make the request to the PNU spell checker, mimicking a browser request
    const response = await fetch('https://speller.cs.pusan.ac.kr/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://speller.cs.pusan.ac.kr/', // Add Referer header
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      console.error(`PNU checker request failed: ${response.status} ${response.statusText}`);
      return NextResponse.json({ message: `Failed to fetch from PNU spell checker: ${response.statusText}` }, { status: response.status });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Find the script tag containing the spell check data
    const errorDataScript = $('script:contains("var data =")').html();
    if (!errorDataScript) {
      // This can happen if there are no errors or the page structure changed.
      return NextResponse.json({ matches: [] });
    }

    // Extract the 'data' variable's value using a regular expression
    const dataMatch = errorDataScript.match(/var data = (\[[\s\S]*?\]);/);
    if (!dataMatch || !dataMatch[1]) {
      console.warn("Could not find 'var data' in script tag.");
      return NextResponse.json({ matches: [] });
    }
    
    // The extracted string is a JavaScript object literal, not valid JSON.
    // This is a fragile conversion process.
    let dataString = dataMatch[1];
    
    // A slightly more robust regex to add quotes to unquoted keys.
    // It looks for a word followed by a colon, but not inside double quotes.
    // This is still not perfect.
    dataString = dataString.replace(/(\s*?{\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '$1"$3":');

    let pnuErrors;
    try {
        pnuErrors = JSON.parse(dataString);
    } catch (e) {
        console.error("Failed to parse PNU error data string into JSON.", e);
        console.error("Problematic data string:", dataString);
        return NextResponse.json({ message: "Failed to parse spell check response from PNU server." }, { status: 500 });
    }

    // Map the parsed errors to the format our frontend expects
    const matches = pnuErrors.map((err: any) => {
        return {
            message: err.help.replace(/<br\s*\/?>/gi, ' '), // Sanitize help text
            replacements: err.candWord.split('|').map((s: string) => ({ value: s })),
            offset: err.start,
            length: err.end - err.start,
        };
    });

    return NextResponse.json({ matches });

  } catch (error) {
    console.error('Korean spell check proxy route error:', error);
    return NextResponse.json({ message: 'An internal error occurred in the spell check proxy.' }, { status: 500 });
  }
}

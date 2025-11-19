import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file found' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;

    const path = join(process.cwd(), 'public', 'uploads', uniqueFilename);
    await writeFile(path, buffer);

    console.log(`File uploaded to ${path}`);

    return NextResponse.json({ success: true, url: `/uploads/${uniqueFilename}` });
  } catch (error) {
    console.error('Upload failed', error);
    return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 });
  }
}

import { Response, ServerError } from '@/lib/response';
import { writeFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export const POST = async (req: NextRequest) => {
  console.clear();
  try {
    const formData = await req.formData();

    const files = formData.getAll('images') as File[];

    if (!files) throw new ServerError('No File Found.', 404);
    if (files.length === 0) throw new ServerError('No File Found.', 404);

    const imageURLs: string[] = [];

    // code to create folder if not exists
    const folderPath = path.join(process.cwd(), 'public/images');
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath);
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Convert the file data to a Buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Replace spaces in the file name with underscores
      const filename = file.name.replaceAll(' ', '_');

      // Write the file to the specified directory (public/images) with the modified filename
      await writeFile(
        path.join(process.cwd(), 'public/images/' + filename),
        buffer
      );

      imageURLs.push(`/images/` + filename);
    }

    const response = Response.success({
      message: 'File Upload Successfuly',
      data: imageURLs,
      statusCode: 201,
    });
    return NextResponse.json(response, { status: response.statusCode });
  } catch (err) {
    const error = Response.error(err);
    return NextResponse.json(error, { status: error.statusCode });
  }
};

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Extract the userId from the query (optional, depending on your requirements)

    // Fetch all categories for the given userId (optional filter)
    const categories = await prisma.bookCategory.findMany({
      orderBy: { createdAt: 'desc' },
    });
    // Return the categories as a JSON response
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST method to create a new category
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { name } = await req.json();

    // Input validation
    if (!name) {
      return NextResponse.json(
        { error: 'Missing required fields: name ' },
        { status: 400 }
      );
    }

    // Check if a category with the same name (case insensitive) already exists
    const existingCategory = await prisma.bookCategory.findFirst({
      where: {
        name: {
          equals: name.toLowerCase(),
        },
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with the same name already exists' },
        { status: 400 }
      );
    }

    // Create a new category
    const newCategory = await prisma.bookCategory.create({
      data: {
        name,
      },
    });

    // Return the newly created category
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

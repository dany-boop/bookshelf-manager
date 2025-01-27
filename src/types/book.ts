export interface Book {
  id: number;
  title: string;
  category?: string;
  language?: string;
  pages?: number;
  author: string;
  status: string;
  userId: string;
  coverImage?: string;
}

// Argument of type '{ category: string | null; status: BookStatus; title: string; language: string | null; id: number; userId: string; description: string | null; author: string; pages: number | null; coverImage: string | null; createdAt: Date; updatedAt: Date; }' is not assignable to parameter of type 'Book'.
//   Types of property 'category' are incompatible.
//     Type 'string | null' is not assignable to type 'string | undefined'.
//       Type 'null' is not assignable to type 'string | undefined'.ts(2345)
// (parameter) book: {
//     category: string | null;
//     status: $Enums.BookStatus;
//     title: string;
//     language: string | null;
//     id: number;
//     userId: string;
//     description: string | null;
//     author: string;
//     pages: number | null;
//     coverImage: string | null;
//     createdAt: Date;
//     updatedAt: Date;
// }

const { nanoid } = require("nanoid");
const bookshelf = require("./bookshelf");

const addBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished;

  if (pageCount === readPage) {
    finished = true;
  } else {
    finished = false;
  }

  const book = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  bookshelf.push(book);

  const isSuccess = bookshelf.filter((item) => item.id === id).length > 0;

  if (name === undefined || name.length === 0 || name == null) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  } if (parseInt(readPage) > parseInt(pageCount)) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  } if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: "error",
    message: "Buku gagal ditambahkan",
  });
  response.code(500);
  return response;
};

const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query;
  if (name !== undefined) {
    const books = bookshelf.filter((data) => data.name.toLowerCase() === name.toLowerCase()).map((item) => ({
      id: item.id,
      name: item.name,
      publisher: item.publisher,
    }));
    const response = h.response({
      status: "success",
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  }
  if ((reading !== null || reading !== undefined) && (parseInt(reading) === 1 || parseInt(reading) === 0)) {
    const books = bookshelf.filter((data) => data.reading === Boolean(parseInt(reading))).map((item) => ({
      id: item.id,
      name: item.name,
      publisher: item.publisher,
    }));
    const response = h.response({
      status: "success",
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  }
  if ((finished !== null || finished !== undefined) && (parseInt(finished) === 1 || parseInt(finished) === 0)) {
    const books = bookshelf.filter((data) => data.finished === Boolean(parseInt(finished))).map((item) => ({
      id: item.id,
      name: item.name,
      publisher: item.publisher,
    }));
    const response = h.response({
      status: "success",
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  }
  const books = bookshelf.map((item) => ({
    id: item.id,
    name: item.name,
    publisher: item.publisher,
  }));
  const response = h.response({
    status: "success",
    data: {
      books,
    },
  });
  response.code(200);
  return response;
};

const getBooksId = (request, h) => {
  const { bookId } = request.params;

  const book = bookshelf.find((item) => item.id === bookId);

  if (book !== undefined || book !== null) {
    const response = h.response({
      status: "success",
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

const editBook = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  if (pageCount === readPage) {
    finished = true;
  } else {
    finished = false;
  }

  const idx = bookshelf.findIndex((item) => item.id === bookId);

  if (name === undefined || name.length === 0 || name == null) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  } if (parseInt(readPage) > parseInt(pageCount)) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  } if (idx !== -1) {
    bookshelf[idx] = {
      ...bookshelf[idx],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: "success",
      message: "Buku Berhasil diperbarui",
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const deleteBook = (request, h) => {
  const { bookId } = request.params;

  const index = bookshelf.findIndex((item) => item.id === bookId);

  if (index !== -1) {
    bookshelf.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  addBook,
  getAllBooks,
  getBooksId,
  editBook,
  deleteBook,
};

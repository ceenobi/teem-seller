import { Pagination } from "react-bootstrap";

export default function Paginate({
  totalPages,
  prevPage,
  nextPage,
  page,
  handlePageChange,
  handleLastPage,
  handleFirstPage,
  itemsPerPage,
}) {
  return (
    <div className="mt-2 d-flex justify-content-center justify-content-md-between align-items-center">
      <span className="d-none d-md-block small fw-semibold">
        {" "}
        {itemsPerPage} Entries Per Page
      </span>
      <Pagination>
        <Pagination.First disabled={!prevPage} onClick={handleFirstPage} />
        <Pagination.Prev
          disabled={!prevPage}
          onClick={() => handlePageChange("prev")}
        />
        <Pagination.Item active className="text-white">
          {page}
        </Pagination.Item>
        <span className="mx-2 mt-1 fw-bold">of</span>
        <Pagination.Item>
          {totalPages}
        </Pagination.Item>
        <Pagination.Next
          disabled={!nextPage}
          onClick={() => handlePageChange("next")}
        />
        <Pagination.Last disabled={!nextPage} onClick={handleLastPage} />
      </Pagination>
    </div>
  );
}

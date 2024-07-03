import styles from "../styles/Pagination.module.css";

const Pagination = ({ items, pageSize, currentPage, onPageChange }) => {
  const pagesCount = Math.ceil(items / pageSize); // 100/10

  if (pagesCount === 1) return null;
  const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);

  return (
    <div className={styles.center}>
      <div className={styles.container}>
        <ul className={styles.pagination}>
          {pages.map((page) => (
            <li
              key={page}
              className={
                page === currentPage ? styles.pageItemActive : styles.pageItem
              }
              onClick={() => onPageChange(page)}
            >
              <a className={styles.pageLink}>{page}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Pagination;

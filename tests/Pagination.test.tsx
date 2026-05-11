import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import Pagination from '../src/components/Pagination';
import { describe, test, vi, expect } from 'vitest';
import '@testing-library/jest-dom';

const defaultProps = {
  nextPage: vi.fn(),
  prevPage: vi.fn(),
  goToPage: vi.fn(),
  loading: false,
  hrefForPage: (page: number) => (page <= 1 ? '/' : `/?page=${page}`),
};

describe("pagination", () => {
  test('renders pagination correctly', () => {
    const { getByRole } = render(<Pagination currentPage={1} totalPages={10} {...defaultProps} />);
    const navigation = getByRole('navigation');
    expect(navigation).toBeInTheDocument()
  });

  test('returns null when totalPages is 1 or less', () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} {...defaultProps} />);
    expect(container.innerHTML).toBe('');
  });

  test('marks first and previous links as aria-disabled on the first page', () => {
    const { getByLabelText } = render(<Pagination currentPage={1} totalPages={10} {...defaultProps} />);
    expect(getByLabelText('Go to first page')).toHaveAttribute('aria-disabled', 'true');
    expect(getByLabelText('Go to previous page')).toHaveAttribute('aria-disabled', 'true');
  });

  test('marks all navigation links as aria-disabled during loading', () => {
    const { getByLabelText } = render(<Pagination currentPage={5} totalPages={20} {...defaultProps} loading={true} />);
    expect(getByLabelText('Go to first page')).toHaveAttribute('aria-disabled', 'true');
    expect(getByLabelText('Go to previous page')).toHaveAttribute('aria-disabled', 'true');
    expect(getByLabelText('Go to next page')).toHaveAttribute('aria-disabled', 'true');
    expect(getByLabelText('Go to last page')).toHaveAttribute('aria-disabled', 'true');
  });

  test('checks if the ellipsis exists', () => {
    const { getAllByText } = render(<Pagination currentPage={5} totalPages={20} {...defaultProps} />);
    expect(getAllByText('...')).toHaveLength(2)
  });

  test('goes to first page when first page link is clicked', () => {
    const goToPage = vi.fn();
    const { getByLabelText } = render(<Pagination currentPage={5} totalPages={20} {...defaultProps} goToPage={goToPage} />);
    fireEvent.click(getByLabelText('Go to first page'));
    expect(goToPage).toHaveBeenCalledWith(1);
    expect(goToPage).toHaveBeenCalledTimes(1);
  });

  test('goes to last page when last page link is clicked', () => {
    const goToPage = vi.fn();
    const { getByLabelText } = render(<Pagination currentPage={5} totalPages={20} {...defaultProps} goToPage={goToPage} />);
    fireEvent.click(getByLabelText('Go to last page'));
    expect(goToPage).toHaveBeenCalledWith(20);
    expect(goToPage).toHaveBeenCalledTimes(1);
  });

  test('goes to the selected page when a page link is clicked', () => {
    const goToPage = vi.fn();
    const { getByText } = render(<Pagination currentPage={5} totalPages={20} {...defaultProps} goToPage={goToPage} />);
    fireEvent.click(getByText('5'));
    expect(goToPage).toHaveBeenCalledWith(5);
    expect(goToPage).toHaveBeenCalledTimes(1);
  });

  test('marks current page with aria-current', () => {
    const { getByLabelText } = render(<Pagination currentPage={5} totalPages={20} {...defaultProps} />);
    expect(getByLabelText('Go to page 5')).toHaveAttribute('aria-current', 'page');
    expect(getByLabelText('Go to page 3')).not.toHaveAttribute('aria-current');
  });

  test('renders links with real hrefs from hrefForPage', () => {
    const { getByLabelText } = render(<Pagination currentPage={5} totalPages={20} {...defaultProps} />);
    expect(getByLabelText('Go to first page')).toHaveAttribute('href', '/');
    expect(getByLabelText('Go to page 5')).toHaveAttribute('href', '/?page=5');
    expect(getByLabelText('Go to last page')).toHaveAttribute('href', '/?page=20');
  });
});

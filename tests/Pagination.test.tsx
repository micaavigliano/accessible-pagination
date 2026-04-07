import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import Pagination from '../src/components/Pagination';
import { describe,test, vi, expect } from 'vitest';
import '@testing-library/jest-dom';

const defaultProps = {
  nextPage: vi.fn(),
  prevPage: vi.fn(),
  goToPage: vi.fn(),
  loading: false,
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

  test('disables first and previous buttons when on first page', () => {
    const { getByLabelText } = render(<Pagination currentPage={1} totalPages={10} {...defaultProps} />);
    expect(getByLabelText('Go to first page')).toBeDisabled();
    expect(getByLabelText('Go to previous page')).toBeDisabled();
  });

  test('disables all buttons during loading', () => {
    const { getByLabelText } = render(<Pagination currentPage={5} totalPages={20} {...defaultProps} loading={true} />);
    expect(getByLabelText('Go to first page')).toBeDisabled();
    expect(getByLabelText('Go to previous page')).toBeDisabled();
    expect(getByLabelText('Go to next page')).toBeDisabled();
    expect(getByLabelText('Go to last page')).toBeDisabled();
  });

  test('checks if the ellipsis exists', () => {
    const { getAllByText } = render(<Pagination currentPage={5} totalPages={20} {...defaultProps} />);
    expect(getAllByText('...')).toHaveLength(2)
  });

  test('goes to first page when first page button is clicked', () => {
    const goToPage = vi.fn();
    const { getByLabelText } = render(<Pagination currentPage={5} totalPages={20} {...defaultProps} goToPage={goToPage} />);
    fireEvent.click(getByLabelText('Go to first page'));
    expect(goToPage).toHaveBeenCalledWith(1);
    expect(goToPage).toHaveBeenCalledTimes(1);
  });

  test('goes to last page when last page button is clicked', () => {
    const goToPage = vi.fn();
    const { getByLabelText } = render(<Pagination currentPage={5} totalPages={20} {...defaultProps} goToPage={goToPage} />);
    fireEvent.click(getByLabelText('Go to last page'));
    expect(goToPage).toHaveBeenCalledWith(20);
    expect(goToPage).toHaveBeenCalledTimes(1);
  });

  test('goes to the selected page when a page button is clicked', () => {
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
});

import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import Pagination from '../src/components/Pagination';
import { describe,test, vi, expect } from 'vitest';
import '@testing-library/jest-dom';

describe("pagination", () => {
  test('renders pagination correctly', () => {
    const nextPage = vi.fn();
    const prevPage = vi.fn();
    const goToPage = vi.fn();
    const { getByRole } = render(<Pagination currentPage={1} totalPages={10} nextPage={nextPage} prevPage={prevPage} goToPage={goToPage}></Pagination>);
    const navigation = getByRole('navigation');
    expect(navigation).toBeInTheDocument()
  });

  test('disables the go to the first item button and go back to the item number 1 button', () => {
    const nextPage = vi.fn();
    const prevPage = vi.fn();
    const goToPage = vi.fn();
    const {getByLabelText } = render(<Pagination currentPage={1} totalPages={10} nextPage={nextPage} prevPage={prevPage} goToPage={goToPage}></Pagination>);
    const firstPageButton = getByLabelText('Go to the first item');
    const goToFirstItemBtn = getByLabelText('go back to the item number 0');
    expect(firstPageButton).toBeDisabled();
    expect(goToFirstItemBtn).toBeDisabled();
  });

  test('checks if the ellipsis exists', () => {
    const nextPage = vi.fn();
    const prevPage = vi.fn();
    const goToPage = vi.fn();
    const { getAllByText } = render(<Pagination currentPage={5} totalPages={20} nextPage={nextPage} prevPage={prevPage} goToPage={goToPage}></Pagination>); 
    expect(getAllByText('...')).toHaveLength(2)
  });

  test('goes to first item when go to first item button is clicked', () => {
    const nextPage = vi.fn();
    const prevPage = vi.fn();
    const goToPage = vi.fn();
    const { getByLabelText } = render(<Pagination currentPage={5} totalPages={20} nextPage={nextPage} prevPage={prevPage} goToPage={goToPage}></Pagination>);
    const firstItem = getByLabelText('Go to the first item');
    fireEvent.click(firstItem);
    expect(goToPage).toHaveBeenCalledWith(1);
    expect(goToPage).toHaveBeenCalledTimes(1);
  });

  test('goes to the last item when go to the last item button is clicked', () => {
    const nextPage = vi.fn();
    const prevPage = vi.fn();
    const goToPage = vi.fn();
    const { getByLabelText } = render(<Pagination currentPage={5} totalPages={20} nextPage={nextPage} prevPage={prevPage} goToPage={goToPage}></Pagination>);
    const lastItem = getByLabelText('go to the last item');
    fireEvent.click(lastItem);
    expect(goToPage).toHaveBeenCalledWith(20);
    expect(goToPage).toHaveBeenCalledTimes(1);
  });

  test('goes to the current item when the button is clicked', () => {
    const nextPage = vi.fn();
    const prevPage = vi.fn();
    const goToPage = vi.fn();
    const { getByText } = render(<Pagination currentPage={5} totalPages={20} nextPage={nextPage} prevPage={prevPage} goToPage={goToPage}></Pagination>);
    const currentItem = getByText('5');
    fireEvent.click(currentItem);
    expect(goToPage).toHaveBeenCalledWith(5);
    expect(goToPage).toHaveBeenCalledTimes(1);
  })
});
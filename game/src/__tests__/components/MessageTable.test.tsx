import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MessageTable from "../../components/ui/tables/MessageTable";

describe("MessageTable", () => {
  const mockItems = [
    { id: 1, time: 1700000000, header: "Test Title 1", news: "Test content 1" },
    { id: 2, time: 1700001000, header: "Test Title 2", news: "Test content 2" },
    { id: 3, time: 1700002000, header: "Test Title 3", news: "Test content 3" },
  ];

  const defaultProps = {
    items: mockItems,
    isDeleting: false,
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders null when items array is empty", () => {
    const { container } = render(<MessageTable {...defaultProps} items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders null when all items are filtered out", () => {
    const { container } = render(
      <MessageTable {...defaultProps} filterRow={() => false} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders a list with one item per message", () => {
    render(<MessageTable {...defaultProps} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(
      screen.getByRole("heading", { name: "Test Title 1" }),
    ).toBeInTheDocument();
  });
  it("uses a custom timeColumnLabel as the time's tooltip", () => {
    const { container } = render(
      <MessageTable {...defaultProps} timeColumnLabel="Date" />,
    );
    container.querySelectorAll("time").forEach((time) => {
      expect(time).toHaveAttribute("title", "Date");
    });
  });
  it("renders all items as rows", () => {
    render(<MessageTable {...defaultProps} />);
    expect(screen.getByText("Test Title 1")).toBeInTheDocument();
    expect(screen.getByText("Test Title 2")).toBeInTheDocument();
    expect(screen.getByText("Test Title 3")).toBeInTheDocument();
    expect(screen.getByText("Test content 1")).toBeInTheDocument();
    expect(screen.getByText("Test content 2")).toBeInTheDocument();
    expect(screen.getByText("Test content 3")).toBeInTheDocument();
  });

  it("formats time correctly using date-fns format", () => {
    const items = [{ id: 1, time: 1700000000, header: "Title", news: "News" }];
    const { container } = render(
      <MessageTable {...defaultProps} items={items} />,
    );
    const time = container.querySelector("time");
    // Formatted in the local timezone, so check the shape
    expect(time?.textContent).toMatch(/\d{2}\/\d{2}-\d{4} \d{2}:\d{2}:\d{2}/);
    expect(time).toHaveAttribute(
      "dateTime",
      new Date(1700000000 * 1000).toISOString(),
    );
  });
  it("renders Delete buttons for each row", () => {
    render(<MessageTable {...defaultProps} />);
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(3);
  });

  it("calls onDelete with correct id when Delete button is clicked", () => {
    const onDelete = jest.fn();
    render(<MessageTable {...defaultProps} onDelete={onDelete} />);
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[1]!);
    expect(onDelete).toHaveBeenCalledWith(2);
  });

  it("disables Delete buttons when isDeleting is true", () => {
    render(<MessageTable {...defaultProps} isDeleting={true} />);
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    deleteButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("enables Delete buttons when isDeleting is false", () => {
    render(<MessageTable {...defaultProps} isDeleting={false} />);
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    deleteButtons.forEach((button) => {
      expect(button).not.toBeDisabled();
    });
  });

  it("filters items using filterRow predicate", () => {
    const filterRow = (item: { id: number }) => item.id !== 2;
    render(<MessageTable {...defaultProps} filterRow={filterRow} />);
    expect(screen.getByText("Test Title 1")).toBeInTheDocument();
    expect(screen.queryByText("Test Title 2")).not.toBeInTheDocument();
    expect(screen.getByText("Test Title 3")).toBeInTheDocument();
  });

  it("marks unread messages as new", () => {
    const items = [
      { id: 1, time: 1700000000, header: "Unread", news: "x", seen: 0 },
      { id: 2, time: 1700000000, header: "Read", news: "y", seen: 1 },
    ];
    render(<MessageTable {...defaultProps} items={items} />);
    expect(screen.getAllByText("New")).toHaveLength(1);
  });
  it("names each delete button after its message", () => {
    render(<MessageTable {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: 'Delete "Test Title 2"' }),
    ).toBeInTheDocument();
  });
  it('uses default timeColumnLabel of "Time" when not specified', () => {
    const { container } = render(<MessageTable {...defaultProps} />);
    expect(container.querySelector("time")).toHaveAttribute("title", "Time");
  });
});

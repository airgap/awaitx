import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReactNode } from "react";
import { Await } from "./Await"; // Update with correct path
import { useFuture } from "use-future";

vi.mock("use-future", () => ({
  useFuture: vi.fn(),
}));

describe("Await component", () => {
  const mockSource = vi.fn();

  it("should render then() when source resolves", async () => {
    const mockValue = "resolved value";
    (useFuture as any).mockReturnValue([mockValue, null, false]);
    const then = vi.fn((value) => <div>{value}</div>);

    render(<Await source={mockSource} then={then} />);

    expect(screen.getByText(mockValue)).toBeInTheDocument();
  });

  it("should render fail() when source rejects", async () => {
    const mockError = "error message";
    (useFuture as any).mockReturnValue([null, mockError, false]);
    const fail = vi.fn((error) => <div>{error}</div>);

    render(<Await source={mockSource} fail={fail} />);

    expect(screen.getByText(mockError)).toBeInTheDocument();
  });

  it("should render meanwhile when loading", async () => {
    (useFuture as any).mockReturnValue([null, null, true]);
    const meanwhile = <div>Loading...</div>;

    render(<Await source={mockSource} meanwhile={meanwhile} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render catchall when provided", async () => {
    const mockValue = "resolved value";
    const mockError = "error message";
    (useFuture as any).mockReturnValue([mockValue, mockError, true]);
    const catchall = vi.fn(() => <div>Catchall</div>);

    render(<Await source={mockSource} catchall={catchall} />);

    expect(screen.getByText("Catchall")).toBeInTheDocument();
  });

  it("should prefer catchall over meanwhile", async () => {
    (useFuture as any).mockReturnValue([null, null, true]);
    const catchall = vi.fn(() => <div>Catchall</div>);
    const meanwhile = <div>Loading...</div>;

    render(
      <Await source={mockSource} catchall={catchall} meanwhile={meanwhile} />,
    );

    expect(screen.getByText("Catchall")).toBeInTheDocument();
  });
});

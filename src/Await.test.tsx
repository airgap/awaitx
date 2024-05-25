import { describe, it, expect } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import { Await } from "./Await";

describe("Await component", () => {
  it('renders the "then" content when the promise resolves successfully', async () => {
    const source = async () => "Success";
    render(
      <Await
        source={source}
        dependencies={[]}
        then={(value) => <div>{value}</div>}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText("Success")).toBeDefined();
    });
  });

  it('renders the "fail" content when the promise rejects', async () => {
    const source = async () => {
      throw new Error("Error");
    };
    render(
      <Await
        source={source}
        dependencies={[]}
        fail={(error) => <div>{String(error)}</div>}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText("Error: Error")).toBeDefined();
    });
  });

  it('renders the "meanwhile" content while the promise is pending', () => {
    const source = async () =>
      new Promise((resolve) => setTimeout(resolve, 100));
    render(
      <Await
        source={source}
        dependencies={[]}
        meanwhile={<div>Loading...</div>}
      />,
    );
    expect(screen.getByText("Loading...")).toBeDefined();
  });

  it('renders the "catchall" content when no other content is provided', async () => {
    const source = async () => "Success";
    render(
      <Await
        source={source}
        dependencies={[]}
        catchall={() => <div>Catchall</div>}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText("Catchall")).toBeDefined();
    });
  });

  it("updates the content when the dependencies change", async () => {
    const source = async (value: string) => value;
    const { rerender } = render(
      <Await
        source={() => source("First")}
        dependencies={["First"]}
        then={(value) => <div>{value}</div>}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText("First")).toBeDefined();
    });
    rerender(
      <Await
        source={() => source("Second")}
        dependencies={["Second"]}
        then={(value) => <div>{value}</div>}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText("Second")).toBeDefined();
    });
  });

  it("does not update the content when the dependencies do not change", async () => {
    const source = async () => "Success";
    const { rerender } = render(
      <Await
        source={source}
        dependencies={[]}
        then={(value) => <div>{value}</div>}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText("Success")).toBeDefined();
    });
    rerender(
      <Await
        source={source}
        dependencies={[]}
        then={(value) => <div>{value}</div>}
      />,
    );
    expect(screen.getByText("Success")).toBeDefined();
  });

  it("renders nothing when no content is provided", () => {
    const source = async () => "Success";
    render(<Await source={source} dependencies={[]} />);
    expect(screen.queryByText("Success")).toBeNull();
  });

  it('renders the "then" content with the resolved value', async () => {
    const source = async () => ({ name: "John", age: 30 });
    render(
      <Await
        source={source}
        dependencies={[]}
        then={(value) => <div>{`${value.name} - ${value.age}`}</div>}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText("John - 30")).toBeDefined();
    });
  });

  it('renders the "fail" content with the rejected error', async () => {
    const source = async () => {
      throw new Error("Custom error message");
    };
    render(
      <Await
        source={source}
        dependencies={[]}
        fail={(error) => <div>{String(error)}</div>}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText("Error: Custom error message")).toBeDefined();
    });
  });
  it('renders the "catchall" content with the resolved value, rejected error, and loading state', async () => {
    const source = async (value: string) => value;
    const { rerender } = render(
      <Await
        source={() => source("Success")}
        dependencies={[]}
        catchall={(value, error, loading) => (
          <div>{`Value: ${value}, Error: ${error}, Loading: ${loading}`}</div>
        )}
      />,
    );
    expect(
      screen.getByText("Value: undefined, Error: undefined, Loading: true"),
    ).toBeDefined();
    await screen.findByText("Value: Success, Error: undefined, Loading: false");

    rerender(
      <Await
        source={() => {
          throw new Error("Error");
        }}
        dependencies={[]}
        catchall={(value, error, loading) => (
          <div>{`Value: ${value}, Error: ${String(error)}, Loading: ${loading}`}</div>
        )}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByText((content, element) => {
          return (
            content.includes("Value: undefined") &&
            content.includes("Error: Error: Error") &&
            content.includes("Loading: false")
          );
        }),
      ).toBeDefined();
    });
  });
});

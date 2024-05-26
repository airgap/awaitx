# awaitx

Await promises for React components

## Installation

To install `awaitx`, use npm or yarn:

```bash
npm install awaitx
```

or

```bash
yarn add awaitx
```

## Usage

`awaitx` provides a simple and intuitive way to handle promises in React components. It allows you to declaratively specify the loading, success, and error states of a promise using the `<Await>` component.

### Example

Before using `awaitx`:

```tsx
export const HotPosts = () => {
  const [posts, setPosts] = useState<Post[]>();
  const [error, setError] = useState<unknown>();
  const [fetchingPosts, setFetchingPosts] = useState(false);

  useEffect(() => {
    if (fetchingPosts || posts || error) return;

    setFetchingPosts(true);
    api
      .listHotPosts({})
      .then(setPosts)
      .catch(setError)
      .finally(() => setFetchingPosts(false));
  }, [fetchingPosts, posts, error]);

  return (
    <>
      {error && <h3>{String(error)}</h3>}
      {posts && <PostList posts={posts} />}
      {fetchingPosts && <>Loading posts...</>}
    </>
  );
};
```

After using `awaitx`:

```tsx
export const HotPosts = () => (
  <Await
    source={() => api.listHotPosts({})}
    then={(posts) => <PostList posts={posts} />}
    fail={(error) => <h3>{String(error)}</h3>}
    meanwhile={<>Loading posts...</>}
  />
);
```

The `<Await>` component takes the following props:

- `source`: A function that returns a promise. This is the promise that will be awaited.
- `then`: A render prop that receives the resolved value of the promise and returns the JSX to render when the promise is fulfilled.
- `fail`: A render prop that receives the error value if the promise is rejected and returns the JSX to render in case of an error.
- `meanwhile`: The JSX to render while the promise is pending.

### Benefits

Using `awaitx` provides several benefits:

- It simplifies the code by eliminating the need for explicit state management and effects.
- It makes the code more declarative and readable by clearly separating the loading, success, and error states.
- It reduces the chances of errors and inconsistencies in handling promise states.

## Contributing

Contributions to `awaitx` are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the [GitHub repository](https://github.com/airgap/awaitx).

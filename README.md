# awaitx
Await promises for React components

## Example

Before:
```tsx
export const HotPosts = () => {
	const [posts, setPosts] = useState<Post[]>();
	const [error, setError] = useState<unknown>();
	const [fetchingPosts, setFetchingPosts] = useState(false);

	useEffect(() => {
		if (fetchingPosts || posts || error) return;
		setFetchingPosts(true);
		api.listHotPosts({})
			.then(setPosts)
			.catch(setError);
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
After:
```tsx
export const HotPosts = () => (
    <Await
        source={() => api.listHotPosts({})}
        then={posts => <PostList posts={posts} />}
        fail={error => <h3>{String(error)}</h3>}
        meanwhile={<>Loading posts...</>}
    />
);
```

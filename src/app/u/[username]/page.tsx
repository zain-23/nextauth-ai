const Page = ({ params }: { params: { username: string } }) => {
  return <div>Hi {params.username}</div>;
};

export default Page;

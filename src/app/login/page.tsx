import LoginForm from "./LoginForm";

type LoginPageProps = {
  searchParams: Promise<{
    registered?: string;
  }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;

  return <LoginForm registered={params.registered === "true"} />;
}

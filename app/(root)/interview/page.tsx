import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();

  const userName = user?.name ?? "Guest";
  const userId = user?.id ?? "";
  const profileImage = user?.profileURL ?? "";

  return (
    <>
      <h3>Interview generation</h3>

      <Agent
        userName={userName}
        userId={userId}
        profileImage={profileImage}
        type="generate"
      />
    </>
  );
};

export default Page;

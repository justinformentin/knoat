import { serverClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "./_components/sidebar";
import NoteArea from "./_components/note-area";

export default async function ProtectedPage() {
  const supabase = await serverClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="">
        <Sidebar />
        <NoteArea />
    </div>
  );
}

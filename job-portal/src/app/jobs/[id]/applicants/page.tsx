import ApplicantsClient from "@/components/ApplicantsClient";

export default function ApplicantsPage({ params }: { params: { id: string } }) {
  return (
    <ApplicantsClient jobId={params.id} />
  );
}

import { ReactNode } from "react";
import { Head } from "@inertiajs/react";



import { PageProps } from "@/types";

import EncoderLayout from "@/Layouts/EncoderLayout";
import OllamaChat from "@/Components/OllamaChat";
import { Info } from "@/types/info";
import CreateEditArticles from "@/Components/CreateEditArticle";
import { Author } from "@/types/author";
import { Agency } from "@/types/agency";
import { Region } from "@/types/region";



const EncoderPostCreateEdit = ({
  id,
  auth,
  info,
  authors,
  agencies,
  regions,
  ckLicense,
  tags
}: {
  id: number,
  auth: PageProps,
  info: Info,
  ckLicense: string
  authors: Author[],
  agencies: Agency[],
  regions: Region[],
  tags: string[]
}) => {

  return (
    <>
      <Head title="Article" />

      {/* card container */}
      <div className="">
        {/* card container */}
        <div
          className="flex justify-center flex-col
					lg:flex-row"
        >
          {/* card input */}
          <CreateEditArticles
              id={id}
              auth={auth}
              info={info}
              ckLicense={ckLicense}

              uri="/encoder/articles"
              authors={authors}
              agencies={agencies}
              regions={regions}

              tags={tags}
          />
          {/* end input card */}
        </div>
        {/* end card container */}

        <OllamaChat />
      </div>
      {/* card container */}
    </>
  );
}

export default EncoderPostCreateEdit;

EncoderPostCreateEdit.layout = (page: ReactNode) => (
  <EncoderLayout user={(page as any).props.auth.user}>
    {page}
  </EncoderLayout>
);

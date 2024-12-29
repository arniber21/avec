
import {HydrateClient} from "~/trpc/server";
import {Title} from "@mantine/core";
import {Navbar} from "~/app/_components/navbar";
import SearchBar from "~/app/_components/searchbar";

export default async function Home() {
    return <HydrateClient>
        <div className={'flex flex-col items-center justify-center h-screen'}>
            <Title order={1}> Avec </Title>
            <SearchBar />
        </div>
    </HydrateClient>;
}

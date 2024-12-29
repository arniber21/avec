'use client'

import {useState} from 'react';
import {Burger, Button, Container, Group, Title} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {MantineLogo} from '@mantinex/mantine-logo';
import classes from '~/app/_components/navbar.module.css';
import {useSession} from "next-auth/react";

const links = [
	{link: '/signin', label: 'Sign In', authed: false},
	{link: '/signout', label: 'Sign Out', authed: true},
];

export function Navbar() {
	const [opened, {toggle}] = useDisclosure(false);
	const [active, setActive] = useState(links[0]?.link);
	const { data: session } = useSession();

	const items = links.map((link) => ( (!!session == link.authed) &&
		<Button
			key={link.label}
			data-active={active === link.link || undefined}
			onClick={(event) => {
				event.preventDefault();
				setActive(link.link);
			}}
		>
			<a href={link.link} >{link.label} </a>
		</Button>
	));

	return (
		<header className={classes.header + 'sticky'}>
			<Container size="md" className={classes.inner}>
				<Title order={3}>Avec</Title>
				<Group gap={5} visibleFrom="xs">
					{items}
				</Group>

				<Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm"/>
			</Container>
		</header>
	);
}
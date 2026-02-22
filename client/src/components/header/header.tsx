import { useEffect, useState } from "react";
import './header.css';

const Header: React.FC = () => {
    const [navigation, setNavigation] = useState<Record<string, string[]>>({});

    useEffect(() => {
        getNavigation();
    }, [])

    const getNavigation = async () => {
        await fetch("/api/navigation").then(async (response) => {
            if (response.ok)
                setNavigation(await response.json());
        });
    }

    return <header className="header">
        <div className="header-inner">
            {
                Object.keys(navigation).map((key: string) => {
                    const links: string[] = navigation[key];

                    return <>
                        <b>{key.replace("_", " ").toUpperCase()}</b>
                        <nav className="nav">
                            <div className="nav-inner">
                                {
                                    Array.from({ length: Math.ceil(links.length / 5) }).map((block, blockIndex: number) => {
                                        return <ul key={`nav-${block}`}>
                                            {
                                                links.filter((_, index: number) => (index >= (5 * blockIndex)) && (index < ((5 * blockIndex) + 5))).map((value: string) => {
                                                    return <li>
                                                        <a href={`?query=${key}[${value.toUpperCase()}]`}>
                                                            {value.toUpperCase()}
                                                        </a>
                                                    </li>
                                                })
                                            }
                                        </ul>
                                    })
                                }
                            </div>
                        </nav>
                    </>
                })
            }
        </div>
    </header>
}

export default Header;
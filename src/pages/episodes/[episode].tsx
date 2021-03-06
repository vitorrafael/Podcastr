import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticProps, GetStaticPaths } from 'next';
import { api } from '../../services/api';

import Image from 'next/image';
import Link from 'next/link';

import convertDurationToTimeString from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss';
import { ParsedUrlQuery } from 'node:querystring';

interface Params extends ParsedUrlQuery {
    episode: string;
}

type Episode = {
    id: string;
    title: string;
    members: string;
    publishedAt: string;
    thumbnail: string;
    duration: number;
    durationAsString: string;
    url: string;
    description: string;
}

type EpisodeProps = {
    episode: Episode
}

export default function Episode({ episode }: EpisodeProps) {
    return (
        <div className={styles.episode}>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>

                <Image width={700} height={160} src={episode.thumbnail} objectFit="cover" />

                <button type="button">
                    <img src="/play.svg" alt="Tocar episódio" />
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }} />
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { episode } = ctx.params as Params;

    const { data } = await api.get(`/episodes/${episode}`);

    const episodeData = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        url: data.file.url,
        description: data.description,
    }

    return {
        props: {
            episode: episodeData
        },
        revalidate: 60 * 60 * 24,
    }
}
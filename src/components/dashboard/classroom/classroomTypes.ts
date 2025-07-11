export interface ClassroomPost {
    id: string;
    type: "announcement" | "assignment" | "material";
    title: string;
    content: string;
    author: string;
    date: string;
    time: string;
    pinned?: boolean;
    attachments?: Array<{
        id: string;
        name: string;
        type: string;
        size: string;
    }>;
    comments?: Array<{
        id: string;
        author: string;
        content: string;
        date: string;
    }>;
}

export interface Activity {
    id: string;
    title: string;
    type: "assignment" | "presentation" | "project";
    status: "pending" | "completed" | "late";
    dueDate?: string;
    description?: string;
}

export const mockActivities: Activity[] = [
    {
        id: "1",
        title: "Trabalho 01 - Prova",
        type: "assignment",
        status: "pending",
        dueDate: "25 de Janeiro",
        description: "Avaliação sobre os conceitos fundamentais",
    },
    {
        id: "2",
        title: "Trabalho 02 - Apresentação",
        type: "presentation",
        status: "pending",
        dueDate: "30 de Janeiro",
        description: "Apresentação do projeto desenvolvido",
    },
    {
        id: "3",
        title: "Trabalho 03 - Apresentação",
        type: "presentation",
        status: "pending",
        dueDate: "5 de Fevereiro",
        description: "Apresentação individual sobre tópico específico",
    },
    {
        id: "4",
        title: "Trabalho 04 - Projeto",
        type: "project",
        status: "pending",
        dueDate: "10 de Fevereiro",
        description: "Desenvolvimento de projeto prático",
    },
];

export const mockPosts: ClassroomPost[] = [
    {
        id: "1",
        type: "announcement",
        title: "Bem-vindos ao curso!",
        content:
            "Olá pessoal! Sejam muito bem-vindos ao nosso curso de Design com Webflow. Estou muito animado para compartilhar conhecimento com vocês. Lembrem-se de sempre participar ativamente das discussões e não hesitem em fazer perguntas.",
        author: "Paulo Henrique",
        date: "15 de Janeiro",
        time: "09:30",
        pinned: true,
        comments: [
            {
                id: "c1",
                author: "Maria Silva",
                content: "Muito obrigada professor! Estou ansiosa para começar.",
                date: "15 de Janeiro",
            },
        ],
    },
    {
        id: "2",
        type: "material",
        title: "Slides da Aula 1 - Introdução ao Webflow",
        content:
            "Compartilho com vocês os slides da nossa primeira aula. Façam download e usem como material de apoio para os estudos.",
        author: "Paulo Henrique",
        date: "16 de Janeiro",
        time: "14:20",
        attachments: [
            {
                id: "a1",
                name: "Aula01-Introducao-Webflow.pdf",
                type: "pdf",
                size: "2.5 MB",
            },
            {
                id: "a2",
                name: "Exercicios-Praticos.zip",
                type: "zip",
                size: "850 KB",
            },
        ],
    },
    {
        id: "3",
        type: "assignment",
        title: "Atividade 1 - Criar conta no Webflow",
        content:
            "Para a próxima aula, todos devem criar uma conta gratuita no Webflow e explorar a interface. Façam capturas de tela das principais seções que encontrarem.",
        author: "Paulo Henrique",
        date: "17 de Janeiro",
        time: "10:15",
        comments: [
            {
                id: "c2",
                author: "João Santos",
                content: "Professor, consegui criar a conta! A interface é bem intuitiva.",
                date: "17 de Janeiro",
            },
            {
                id: "c3",
                author: "Ana Costa",
                content:
                    "Tenho uma dúvida sobre o plano gratuito. Ele tem todas as funcionalidades?",
                date: "17 de Janeiro",
            },
        ],
    },
];

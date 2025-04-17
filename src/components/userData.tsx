import { useEffect, useState } from "react";
import { post } from "@aws-amplify/api";

interface User {
    id: string;
    name: string;
    lastname: string;
    nickname: string;
    email: string;
    phone: string;
    birthdate: string;
    createdAt: string;
}

interface UserDataProps {
    userId: string;
}

export function UserData({ userId }: UserDataProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        async function fetchUser() {
            setLoading(true);
            setError(null);
            try {
                const operation = post({
                    apiName: "users", // must match aws-exports.js
                    path: "/getUser",
                    options: { body: { id: userId } },
                });
                const apiResponse = await operation.response;
                const data = await apiResponse.body.json();
                setUser(data);
            } catch (err: any) {
                setError(err.message || "Erreur lors du chargement");
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [userId]);

    if (loading) {
        return <p>Chargement des données...</p>;
    }

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    if (!user) {
        return <p>Aucun utilisateur trouvé.</p>;
    }

    return (
        <div
            style={{
                maxWidth: "400px",
                margin: "1rem auto",
                padding: "1.5rem",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                fontFamily: "sans-serif",
                background: "#fff",
            }}
        >
            <h2 style={{ marginBottom: "0.5rem" }}>Profil Utilisateur</h2>
            <p>
                <strong>Nom complet :</strong> {user.name} {user.lastname}
            </p>
            <p>
                <strong>Pseudonyme :</strong> {user.nickname}
            </p>
            <p>
                <strong>Email :</strong> {user.email}
            </p>
            <p>
                <strong>Téléphone :</strong> {user.phone}
            </p>
            <p>
                <strong>Date de naissance :</strong>{" "}
                {new Date(user.birthdate).toLocaleDateString()}
            </p>
            <p>
                <strong>Compte créé le :</strong>{" "}
                {new Date(user.createdAt).toLocaleString()}
            </p>
        </div>
    );
}

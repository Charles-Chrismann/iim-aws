
interface UserDataProps {
    userId: string;
    user: Record<string, any>
    loading: boolean
    error: string | null
}

export function UserData({ user, loading, error }: UserDataProps) {

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
                maxWidth: "768px",
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

import { useEffect, useState } from 'react';
import { get, put, del } from '@aws-amplify/api';

type Address = {
  addressId: string;
  country: string;
  street: string;
  postalCode: string;
};

type UserAddressesProps = {
  userId: string;
  refreshSignal: boolean;
};

export const UserAddresses = ({ userId, refreshSignal }: UserAddressesProps) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedAddress, setEditedAddress] = useState<Omit<Address, 'addressId'>>({
    country: '',
    street: '',
    postalCode: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await get({
        path: `/users/${userId}/addresses`,
        apiName: 'users',
      }).response;

      const text = await res.body.text();
      const data = JSON.parse(text);

      setAddresses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur de récupération des adresses:', err);
      setError('Impossible de récupérer les adresses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [userId, refreshSignal]);

  const handleEditClick = (address: Address) => {
    if (loading) return;
    setEditingId(address.addressId);
    setEditedAddress({
      country: address.country,
      street: address.street,
      postalCode: address.postalCode,
    });
  };

  const handleChange = (field: keyof Omit<Address, 'addressId'>, value: string) => {
    setEditedAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedAddress({ country: '', street: '', postalCode: '' });
  };

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const handleValidate = async () => {
    if (!editingId) return;
    setLoading(true);
    try {
      await put({
        path: `/users/${userId}/addresses/update/${editingId}`,
        apiName: 'users',
        options: {
          body: editedAddress,
        },
      });

      await delay(1500);
      await fetchAddresses();

      setEditingId(null);
      setEditedAddress({ country: '', street: '', postalCode: '' });
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      alert('Erreur lors de la mise à jour.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!window.confirm('Supprimer cette adresse ?')) return;

    setLoading(true);
    try {
      await del({
        path: `/users/${userId}/addresses/delete/${addressId}`,
        apiName: 'users',
      });

      await delay(1500);
      await fetchAddresses();
    } catch (err) {
      console.error('Erreur de suppression:', err);
      alert('Erreur lors de la suppression.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="flex justify-center items-center mt-10">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) return <p className="text-red-600">{error}</p>;
  if (addresses.length === 0) return <p className="text-gray-500">Aucune adresse trouvée.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Adresses enregistrées 📬</h2>

      <ul className="space-y-4">
        {addresses.map((address) => (
          <li key={address.addressId} className="border border-gray-200 rounded-xl p-4">
            {editingId === address.addressId ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={editedAddress.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="input input-bordered"
                  placeholder="Pays"
                />
                <input
                  type="text"
                  value={editedAddress.street}
                  onChange={(e) => handleChange('street', e.target.value)}
                  className="input input-bordered"
                  placeholder="Rue"
                />
                <input
                  type="text"
                  value={editedAddress.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                  className="input input-bordered"
                  placeholder="Code postal"
                />
                <div className="col-span-full flex gap-2 mt-2">
                  <button
                    onClick={handleValidate}
                    disabled={loading}
                    className={`px-3 py-1 rounded text-white transition ${
                      loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    Valider
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={loading}
                    className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400 transition"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p>
                  <strong>Pays :</strong> {address.country}
                </p>
                <p>
                  <strong>Rue :</strong> {address.street}
                </p>
                <p>
                  <strong>Code postal :</strong> {address.postalCode}
                </p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEditClick(address)}
                    disabled={loading}
                    className={`text-sm ${
                      loading
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-600 hover:underline'
                    }`}
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(address.addressId)}
                    disabled={loading}
                    className={`text-sm ${
                      loading
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-red-600 hover:underline'
                    }`}
                  >
                    🗑 Supprimer
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

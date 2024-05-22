"use client"
import { ref, get, set, child, DatabaseReference, DataSnapshot, push, update, remove } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { database, auth, firestore, storage } from '@/firebase/config';
import { useRouter } from 'next/navigation';
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { ref as refStorage, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";

export default function Firebase() {
    const router = useRouter()

    function getPhoto() {
        const storageRef = refStorage(storage, 'images/AWS.jpg');
        getDownloadURL(storageRef).then((url) => {
            console.log(url);
        });
    }

    function getUsersData() {
        const dbRef: DatabaseReference = ref(database);
        get(child(dbRef, 'posts/'))
            .then((snapshot: DataSnapshot) => {
                if (snapshot.exists()) {
                    console.log('Success get data: ', snapshot.val());
                } else {
                    console.log('No data available');
                }
            })
            .catch((error: Error) => {
                console.error(error);
            });
    }

    function writeUserData(id: number, name: string) {
        set(ref(database, 'users/' + id), {
            id: id,
            name: name,
        });
    }

    function writeNewPost(
        uid: string,
        username: string,
        picture: string,
        title: string,
        body: string
    ): Promise<void> {
        // A post entry.
        const postData: {
            author: string;
            uid: string;
            body: string;
            title: string;
            starCount: number;
            authorPicture: string;
        } = {
            author: username,
            uid: uid,
            body: body,
            title: title,
            starCount: 0,
            authorPicture: picture,
        };

        // Get a key for a new Post.
        // const newPostKey: string = push(child(ref(database), 'posts')).key ?? '';

        // Write the new post's data simultaneously in the posts list and the user's post list.
        const updates: { [key: string]: any } = {};
        updates['/posts/'] = postData;
        updates['/user_posts/' + uid + '/'] = postData;

        return update(ref(database), updates);
    }

    function deleteUser(id: number) {
        const userRef = ref(database, `users/${id}`);

        remove(userRef)
            .then(() => {
                console.log('User deleted successfully');
            })
            .catch((error) => {
                console.error('Error deleting user:', error);
            });

        // set(userRef, null)
        //   .then(() => {
        //     console.log('User deleted successfully');
        //   })
        //   .catch((error) => {
        //     console.error('Error deleting user:', error);
        //   });
    }

    function handleLogout() {
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log('Logout successful');
            router.push('/login');

        }).catch((error) => {
            // An error happened.
            console.error(error);
        });
    }

    async function addDocument() {
        try {
            await setDoc(doc(firestore, "cities", "LA"), {
                name: "Los Angeles",
                state: "CA",
                country: "USA"
            });
            console.log("Document written with ID: ", "LA");
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    return (
        <>
            <div>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    onClick={() => getPhoto()}
                >
                    Get Photo
                </button>
            </div>
            <br />
            <div>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    onClick={() => getUsersData()}
                >
                    Get Data
                </button>
            </div>
            <br />
            <div>
                <button
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                    onClick={() => writeUserData(3, 'Vicario')}
                >
                    Write Data
                </button>
            </div>
            <br />
            <div>
                <button
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                    onClick={() => addDocument()}
                >
                    Add Document
                </button>
            </div>
            <br />
            <div>
                <button
                    className="bg-emerald-400 hover:bg-emerald-600 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                    onClick={() => writeNewPost('1', 'Vicario', 'https://picsum.photos/200', 'Title', 'Body')}
                >
                    Update Data
                </button>
            </div>
            <br />
            <div>
                <button
                    className="bg-black text-white font-bold py-2 px-4 border border-blue-700 rounded"
                    onClick={() => deleteUser(3)}
                >
                    Delete Data
                </button>
            </div>
            <br />
            <div>
                <button
                    className="bg-red-600 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                    onClick={() => handleLogout()}
                >
                    Logout
                </button>
            </div>
        </>
    )
}
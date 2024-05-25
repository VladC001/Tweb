import React, { useState } from 'react';
import { Button, Form, Input, Layout, Menu, Select } from 'antd';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';

const { Item: MenuItem } = Menu;
const { Header, Content, Footer } = Layout;
const { Option } = Select;

class Store {
    items = new Array(3).fill(null).map((_, index) => ({
        key: (index + 1).toString(),
        NrCard: generateRandomCardNumber(),
        NumberOfCard: `Card ${index + 1}`,
        DateOfExpire: generateRandomDateOfExpire(),
        NameOfOwner: romanianNames[Math.floor(Math.random() * romanianNames.length)],
        CVC: generateRandomCVC(),
        color: generateRandomColor(),
        bank: generateRandomBank(),
    }));

    users = [
        { username: 'user1', password: 'password1' },
        { username: 'user2', password: 'password2' },
    ];

    constructor() {
        makeAutoObservable(this);
        this.initializeData();
        this.initializeUsers();
    }

    saveDataToLocalStorage = (key: string, data: any) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    getDataFromLocalStorage = (key: string) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    };

    initializeData = () => {
        const storedData = this.getDataFromLocalStorage('items');
        if (!storedData) {
            this.saveDataToLocalStorage('items', this.items);
        }
    };

    initializeUsers = () => {
        const storedUsers = this.getDataFromLocalStorage('users');
        if (!storedUsers) {
            this.saveDataToLocalStorage('users', this.users);
        }
    };

    updateItem = (key: string, data: any) => {
        const storedData = this.getDataFromLocalStorage('items');
        const updatedData = storedData.map((item: any) => (item.key === key ? { ...item, ...data } : item));
        this.saveDataToLocalStorage('items', updatedData);
    };

    checkCredentials = (username: string, password: string) => {
        return this.users.some((user) => user.username === username && user.password === password);
    };
}

const generateRandomCardNumber = () => {
    const generatePart = () => Math.floor(1000 + Math.random() * 9000);
    return `${generatePart()} ${generatePart()} ${generatePart()} ${generatePart()}`;
};

const generateRandomDateOfExpire = () => {
    const generateMonth = () => String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const generateYear = () => String(Math.floor(Math.random() * 10) + 22);
    return `${generateMonth()}/${generateYear()}`;
};

const generateRandomCVC = () => String(Math.floor(100 + Math.random() * 900));

const romanianNames = [
    'Andrei Popescu',
    'Maria Ionescu',
    'Ion Vasilescu',
    'Elena Dumitrescu',
    'Alexandru Radulescu',
    'Ana Stanciu',
    'Mihai Stefanescu',
    'Cristina Stan',
    'George Nicolescu',
    'Laura Ungureanu',
];

const generateRandomBank = () => {
    const banks = ['MAIB', 'Gringotts', 'MICB'];
    return banks[Math.floor(Math.random() * banks.length)];
};

const generateRandomColor = () => {
    const colors = ['blue', 'red', 'green', 'yellow'];
    return colors[Math.floor(Math.random() * colors.length)];
};

const store = new Store();

const CustomForm = observer(() => {
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formData, setFormData] = useState<any>(null);
    const [selectedItem, setSelectedItem] = useState('1');

    const onFinish = (values: any) => {
        setFormSubmitted(true);
        setFormData(values);
        store.updateItem(selectedItem, values);

        console.log('Formular trimis cu valorile:', values);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Form onFinish={onFinish} style={{ width: '400px' }}>
                <Form.Item
                    label="Număr card"
                    name="cardNumber"
                    rules={[
                        { required: true, message: 'Vă rugăm să introduceți numărul cardului' },
                        { pattern: /^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$/, message: 'Numărul cardului trebuie să aibă formatul 0000 0000 0000 0000' }
                    ]}
                >
                    <Input placeholder="Introduceți numărul cardului" />
                </Form.Item>
                {/* Add other form items here */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Trimite
                    </Button>
                </Form.Item>
            </Form>
            {formSubmitted && (
                <div>
                    <h2>Datele formularului:</h2>
                    <p>Număr card: {formData.cardNumber}</p>
                    {/* Add other form data here */}
                </div>
            )}
        </div>
    );
});

const LoginForm = observer(() => {
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formData, setFormData] = useState<any>(null);
    const [loginError, setLoginError] = useState(false);

    const onFinish = (values: any) => {
        setFormSubmitted(true);
        setFormData(values);
        const { username, password } = values;
        const isAuthenticated = store.checkCredentials(username, password);

        if (isAuthenticated) {
            setLoginError(false);
            console.log('Autentificare reușită pentru utilizatorul:', username);
        } else {
            setLoginError(true);
            console.log('Autentificare eșuată pentru utilizatorul:', username);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Form onFinish={onFinish} style={{ width: '400px' }}>
                <Form.Item
                    label="Nume utilizator"
                    name="username"
                    rules={[{ required: true, message: 'Vă rugăm să introduceți numele de utilizator' }]}
                >
                    <Input placeholder="Introduceți numele de utilizator" />
                </Form.Item>
                <Form.Item
                    label="Parolă"
                    name="password"
                    rules={[{ required: true, message: 'Vă rugăm să introduceți parola' }]}
                >
                    <Input.Password placeholder="Introduceți parola" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Autentificare
                    </Button>
                </Form.Item>
                {formSubmitted && loginError && <p style={{ color: 'red' }}>Nume de utilizator sau parolă incorecte</p>}
                {formSubmitted && !loginError && <p style={{ color: 'green' }}>Autentificare reușită!</p>}
            </Form>
        </div>
    );
});

const validateCVC = (_: any, value: string) => {
    if (!value) {
        return Promise.reject('Vă rugăm să introduceți CVC-ul');
    }
    if (!/^\d{3}$/.test(value)) {
        return Promise.reject('Vă rugăm să introduceți un CVC valid (3 cifre)');
    }
    return Promise.resolve();
};

const fetchDataWithLoading = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const storedData = store.getDataFromLocalStorage('items');
    if (storedData) {
        store.items = storedData;
    }
};

fetchDataWithLoading();

const App = observer(() => {
    const [selectedItem, setSelectedItem] = useState('1');
    const [currentRoute, setCurrentRoute] = useState('cards');

    const handleMenuItemClick = (item: { key: string }) => {
        setSelectedItem(item.key);
        setCurrentRoute(item.key);
    };
    const showUsersDataFromLocalStorage = () => {
        const userData = localStorage.getItem('users');
        console.log('Datele de autentificare din localStorage:', userData);
    };
    const showLocalStorageData = () => {
        const data = localStorage.getItem('items');
        console.log('Datele din localStorage:', data);
    };

    const selectedCard = store.items.find((item) => item.key === selectedItem);

    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className="demo-logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    selectedKeys={[selectedItem]}
                    onClick={handleMenuItemClick}
                    style={{ flex: 1, minWidth: 0 }}
                >
                    {store.items.map(item => (
                        <MenuItem key={item.key}>{item.NumberOfCard}</MenuItem>
                    ))}
                    <MenuItem key="form">Formular</MenuItem>
                    <MenuItem key="login">Autentificare</MenuItem>
                </Menu>
                <Button onClick={showLocalStorageData} style={{ marginLeft: '16px' }}>Card-localStorage</Button>
                <Button onClick={showUsersDataFromLocalStorage}>Autentificare-localStorage</Button>
            </Header>
            <Content style={{ padding: '0 48px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div
                    style={{
                        background: '#fff',
                        width: '60%',
                        padding: '24px',
                        borderRadius: '5px',
                        textAlign: 'center',
                    }}
                >
                    {currentRoute === 'form' ? <CustomForm /> : (
                        currentRoute === 'login' ? <LoginForm /> : (
                            <>
                                <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Cardul {selectedCard?.NrCard}</h2>
                                <p style={{ fontSize: '20px', marginBottom: '8px' }}>Numele proprietarului: {selectedCard?.NameOfOwner}</p>
                                <p style={{ fontSize: '20px', marginBottom: '8px' }}>Data expirării: {selectedCard?.DateOfExpire}</p>
                                <p style={{ fontSize: '20px', marginBottom: '8px' }}>CVC: {selectedCard?.CVC}</p>
                                <p style={{ fontSize: '20px', marginBottom: '8px' }}>Culoare: {selectedCard?.color}</p>
                                <p style={{ fontSize: '20px', marginBottom: '8px' }}>Bank: {selectedCard?.bank}</p>
                            </>
                        )
                    )}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Ant Design ©{new Date().getFullYear()} Creat de Ant UED
            </Footer>
        </Layout>
    );
});

export default App;

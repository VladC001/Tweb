import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button, Form, Input, Layout, Menu, Select } from 'antd';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';
import CardDetails from './CardDetails'; // Ensure this path is correct

const { Item: MenuItem } = Menu;
const { Header, Content, Footer } = Layout;
const { Option } = Select;

interface CardItem {
    key: string;
    NrCard: string;
    NumberOfCard: string;
    DateOfExpire: string;
    NameOfOwner: string;
    CVC: string;
    color: string;
    bank: string;
}

interface User {
    username: string;
    password: string;
}

class Store {
    items: CardItem[] = new Array(3).fill(null).map((_, index) => ({
        key: (index + 1).toString(),
        NrCard: generateRandomCardNumber(),
        NumberOfCard: `Card ${index + 1}`,
        DateOfExpire: generateRandomDateOfExpire(),
        NameOfOwner: romanianNames[Math.floor(Math.random() * romanianNames.length)],
        CVC: generateRandomCVC(),
        color: generateRandomColor(),
        bank: generateRandomBank(),
    }));

    users: User[] = [
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

    updateItem = (key: string, data: Partial<CardItem>) => {
        const storedData = this.getDataFromLocalStorage('items') || [];
        const updatedData = storedData.map((item: CardItem) => (item.key === key ? { ...item, ...data } : item));
        this.saveDataToLocalStorage('items', updatedData);
    };

    checkCredentials = (username: string, password: string) => {
        return this.users.some(user => user.username === username && user.password === password);
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
    'Andrei Popescu', 'Maria Ionescu', 'Ion Vasilescu', 'Elena Dumitrescu',
    'Alexandru Radulescu', 'Ana Stanciu', 'Mihai Stefanescu', 'Cristina Stan',
    'George Nicolescu', 'Laura Ungureanu'
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
                    rules={[{ required: true, message: 'Vă rugăm să introduceți numărul cardului' }]}
                >
                    <Input placeholder="Introduceți numărul cardului" />
                </Form.Item>
                <Form.Item
                    label="Data expirării"
                    name="expiryDate"
                    rules={[{ required: true, message: 'Vă rugăm să introduceți data expirării' }]}
                >
                    <Input placeholder="Introduceți data expirării" />
                </Form.Item>
                <Form.Item
                    label="CVC"
                    name="cvc"
                    rules={[
                        { required: true, message: 'Vă rugăm să introduceți CVC-ul' },
                        { validator: validateCVC },
                    ]}
                >
                    <Input placeholder="Introduceți CVC-ul" />
                </Form.Item>
                <Form.Item
                    label="Culoare"
                    name="color"
                    rules={[{ required: true, message: 'Vă rugăm să introduceți culoarea' }]}
                >
                    <Input placeholder="Introduceți culoarea" />
                </Form.Item>
                <Form.Item
                    label="Bank"
                    name="bank"
                    rules={[{ required: true, message: 'Vă rugăm să introduceți banca' }]}
                >
                    <Select placeholder="Selectează bancă">
                        <Option value="MAIB">MAIB</Option>
                        <Option value="Gringotts">Gringotts</Option>
                        <Option value="MICB">MICB</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Trimite
                    </Button>
                </Form.Item>
            </Form>
            {formSubmitted && formData && (
                <div>
                    <h2>Datele formularului:</h2>
                    <p>Număr card: {formData.cardNumber}</p>
                    <p>Data expirării: {formData.expiryDate}</p>
                    <p>CVC: {formData.cvc}</p>
                    <p>Culoare: {formData.color}</p>
                    <p>Bank: {formData.bank}</p>
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
            return;
        }

        setLoginError(true);
        console.log('Autentificare eșuată pentru utilizatorul:', username);
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
            </Form>
            {loginError && (
                <div>
                    <p style={{ color: 'red' }}>Nume utilizator sau parolă incorectă</p>
                </div>
            )}
        </div>
    );
});

const App = () => (
    <Router>
        <Layout className="layout">
            <Header>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                    <MenuItem key="1">
                        <Link to="/">Acasă</Link>
                    </MenuItem>
                    <MenuItem key="2">
                        <Link to="/form">Formular</Link>
                    </MenuItem>
                    <MenuItem key="3">
                        <Link to="/login">Autentificare</Link>
                    </MenuItem>
                </Menu>
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <div className="site-layout-content" style={{ margin: '16px 0' }}>
                    <Routes>
                        <Route path="/" element={<h1>Bun venit!</h1>} />
                        <Route path="/form" element={<CustomForm />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/card-details" element={<CardDetails />} />
                    </Routes>
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
        </Layout>
    </Router>
);

export default App;

function validateCVC(_: any, value: string) {
    if (/^\d{3}$/.test(value)) {
        return Promise.resolve();
    }
    return Promise.reject(new Error('CVC-ul trebuie să fie un număr de 3 cifre'));
}

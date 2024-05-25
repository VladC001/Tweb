import React, { useState } from 'react';
import { Button, Form, Input, Layout, Menu, Select } from 'antd';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';

const { Item: MenuItem } = Menu;
const { Header, Content, Footer } = Layout;
const { Option } = Select;

interface Item {
    key: string;
    NrCard: string;
    NumberOfCard: string;
    DateOfExpire: string;
    NameOfOwner: string;
    CVC: string;
    color: string;
    bank: string;
}

class Store {
    items: Item[] = new Array(3).fill(null).map((_, index) => ({
        key: (index + 1).toString(),
        NrCard: generateRandomCardNumber(),
        NumberOfCard: `Card ${index + 1}`,
        DateOfExpire: generateRandomDateOfExpire(),
        NameOfOwner: romanianNames[Math.floor(Math.random() * romanianNames.length)],
        CVC: generateRandomCVC(),
        color: generateRandomColor(),
        bank: generateRandomBank(),
    }));

    constructor() {
        makeAutoObservable(this);
        this.initializeData();
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

    updateItem = (key: string, data: Partial<Item>) => {
        const storedData: Item[] = this.getDataFromLocalStorage('items');
        const updatedData = storedData.map(item => (item.key === key ? { ...item, ...data } : item));
        this.saveDataToLocalStorage('items', updatedData);
    };
}

const generateRandomCardNumber = (): string => {
    const generatePart = () => Math.floor(1000 + Math.random() * 9000).toString();
    return `${generatePart()} ${generatePart()} ${generatePart()} ${generatePart()}`;
};

const generateRandomDateOfExpire = (): string => {
    const generateMonth = () => String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const generateYear = () => String(Math.floor(Math.random() * 10) + 22);
    return `${generateMonth()}/${generateYear()}`;
};

const generateRandomCVC = (): string => String(Math.floor(100 + Math.random() * 900));

const romanianNames = [
    'Andrei Popescu', 'Maria Ionescu', 'Ion Vasilescu', 'Elena Dumitrescu',
    'Alexandru Radulescu', 'Ana Stanciu', 'Mihai Stefanescu', 'Cristina Stan',
    'George Nicolescu', 'Laura Ungureanu'
];

const generateRandomBank = (): string => {
    const banks = ['MAIB', 'Gringotts', 'MICB'];
    return banks[Math.floor(Math.random() * banks.length)];
};

const generateRandomColor = (): string => {
    const colors = ['blue', 'red', 'green', 'yellow'];
    return colors[Math.floor(Math.random() * colors.length)];
};

const store = new Store();

const CustomForm = observer(() => {
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formData, setFormData] = useState<Partial<Item> | null>(null);
    const [selectedItem, setSelectedItem] = useState('1');

    const onFinish = (values: Partial<Item>) => {
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
                    name="NrCard"
                    rules={[
                        { required: true, message: 'Vă rugăm să introduceți numărul cardului' },
                        { pattern: /^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$/, message: 'Număr card invalid' }
                    ]}
                >
                    <Input placeholder="Introduceți numărul cardului" />
                </Form.Item>
                <Form.Item
                    label="Data expirării"
                    name="DateOfExpire"
                    rules={[
                        { required: true, message: 'Vă rugăm să introduceți data expirării' },
                        { pattern: /^(0[1-9]|1[0-2])\/[0-9]{2}$/, message: 'Dată de expirare invalidă' }
                    ]}
                >
                    <Input placeholder="Introduceți data expirării" />
                </Form.Item>
                <Form.Item
                    label="CVC"
                    name="CVC"
                    rules={[
                        { required: true, message: 'Vă rugăm să introduceți CVC-ul' },
                        { validator: validateCVC }
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
                    <p>Număr card: {formData.NrCard}</p>
                    <p>Data expirării: {formData.DateOfExpire}</p>
                    <p>CVC: {formData.CVC}</p>
                    <p>Culoare: {formData.color}</p>
                    <p>Bank: {formData.bank}</p>
                </div>
            )}
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

    const handleMenuItemClick = (item: any) => setSelectedItem(item.key);
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
                </Menu>
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
                    {selectedItem === 'form' ? <CustomForm /> : (
                        <>
                            <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Cardul {selectedCard?.NrCard}</h2>
                            <p style={{ fontSize: '20px', marginBottom: '8px' }}>Numele proprietarului: {selectedCard?.NameOfOwner}</p>
                            <p style={{ fontSize: '20px', marginBottom: '8px' }}>Data expirării: {selectedCard?.DateOfExpire}</p>
                            <p style={{ fontSize: '20px', marginBottom: '8px' }}>CVC: {selectedCard?.CVC}</p>
                            <p style={{ fontSize: '20px', marginBottom: '8px' }}>Culoare: {selectedCard?.color}</p>
                            <p style={{ fontSize: '20px', marginBottom: '8px' }}>Bank: {selectedCard?.bank}</p>
                        </>
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

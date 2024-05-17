import React, { useState } from 'react';
import { Button, Form, Input, Layout, Menu } from 'antd';

const { Item: MenuItem } = Menu;
const { Header, Content, Footer } = Layout;

interface Card {
  key: string;
  NrCard: string;
  NumberOfCard: string;
  DateOfExpire: string;
  NameOfOwner: string;
  CVC: string;
}

const generateRandomCardNumber = (): string => {
  const generatePart = () => Math.floor(1000 + Math.random() * 9000).toString();
  return `${generatePart()} ${generatePart()} ${generatePart()} ${generatePart()}`;
};

const generateRandomDateOfExpire = (): string => {
  const generateMonth = () => String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const generateYear = () => String(Math.floor(Math.random() * 10) + 22); // Values between 2022 and 2031
  return `${generateMonth()}/${generateYear()}`;
};

const generateRandomCVC = (): string => String(Math.floor(100 + Math.random() * 900)); // 3-digit CVC

const romanianNames = [
  'Andrei Popescu', 'Maria Ionescu', 'Ion Vasilescu', 'Elena Dumitrescu', 'Alexandru Radulescu',
  'Ana Stanciu', 'Mihai Stefanescu', 'Cristina Stan', 'George Nicolescu', 'Laura Ungureanu'
];

const items: Card[] = new Array(3).fill(null).map((_, index) => ({
  key: (index + 1).toString(),
  NrCard: generateRandomCardNumber(),
  NumberOfCard: `Card ${index + 1}`,
  DateOfExpire: generateRandomDateOfExpire(),
  NameOfOwner: romanianNames[Math.floor(Math.random() * romanianNames.length)],
  CVC: generateRandomCVC(),
}));

const validateCVC = (_: any, value: string) => {
  if (!value) {
    return Promise.reject('Vă rugăm să introduceți CVC-ul');
  }
  if (!/^\d{3}$/.test(value)) {
    return Promise.reject('Vă rugăm să introduceți un CVC valid (3 cifre)');
  }
  return Promise.resolve();
};

const CustomForm: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const onFinish = (values: any) => {
    setFormSubmitted(true);
    setFormData(values);
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
              <p>Data expirării: {formData.expiryDate}</p>
              <p>CVC: {formData.cvc}</p>
            </div>
        )}
      </div>
  );
};

const App: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState('1');
  const handleMenuItemClick = (item: any) => setSelectedItem(item.key);
  const selectedCard = items.find((item) => item.key === selectedItem);

  return (
      <Layout>
        <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: '#1890ff' }}>
          <div className="demo-logo" />
          <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['1']}
              selectedKeys={[selectedItem]}
              onClick={handleMenuItemClick}
              style={{ flex: 1, minWidth: 0 }}
          >
            {items.map(item => (
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
                </>
            )}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center', backgroundColor: '#e6f7ff' }}>
          Ant Design ©{new Date().getFullYear()} Creat de Ant UED
        </Footer>
      </Layout>
  );
};

export default App;

import { StyleSheet } from '@react-pdf/renderer'

export const receiptStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },

  // Header styles
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #1976d2',
    paddingBottom: 15,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: 80,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  receiptTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#333',
  },
  receiptNumber: {
    fontSize: 12,
    textAlign: 'right',
    color: '#666',
    marginTop: 5,
  },
  headerInfo: {
    fontSize: 9,
    color: '#666',
    lineHeight: 1.4,
  },

  // Body styles
  body: {
    marginTop: 20,
    marginBottom: 30,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 10,
    borderBottom: '1 solid #e0e0e0',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: '40%',
    fontSize: 10,
    color: '#666',
  },
  value: {
    width: '60%',
    fontSize: 10,
    color: '#333',
    fontWeight: 'bold',
  },

  // Amount box
  amountBox: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    border: '1 solid #e0e0e0',
  },
  amountLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 5,
  },
  amountValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
  },

  // Notes
  notes: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#fffde7',
    borderLeft: '3 solid #fbc02d',
  },
  notesLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  notesText: {
    fontSize: 9,
    color: '#666',
    lineHeight: 1.4,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    borderTop: '1 solid #e0e0e0',
    paddingTop: 15,
  },
  footerText: {
    fontSize: 8,
    color: '#999',
    textAlign: 'center',
    lineHeight: 1.5,
  },
  signature: {
    marginTop: 40,
    textAlign: 'center',
  },
  signatureLine: {
    width: 200,
    borderTop: '1 solid #666',
    marginHorizontal: 'auto',
    marginBottom: 5,
  },
  signatureLabel: {
    fontSize: 9,
    color: '#666',
  },
})

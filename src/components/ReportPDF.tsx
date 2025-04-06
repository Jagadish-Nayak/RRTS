'use client';
import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
      padding: 20, // reduced from 30
      backgroundColor: '#ffffff',
    },
    header: {
      marginBottom: 10, // reduced from 20
      borderBottom: '1 solid #eaeaea',
      paddingBottom: 5, // reduced from 10
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      width: 60, // slightly smaller
      height: 60,
    },
    title: {
      fontSize: 22, // slightly reduced
      fontWeight: 'bold',
      marginBottom: 4,
      color: '#333',
    },
    reportId: {
      fontSize: 11, // slightly reduced
      color: '#777',
    },
    section: {
      marginVertical: 6, // reduced from 10
    },
    sectionTitle: {
      fontSize: 13, // slightly reduced
      fontWeight: 'bold',
      marginBottom: 3, // reduced from 5
      color: '#333',
      backgroundColor: '#f5f5f5',
      padding: 4, // reduced from 5
    },
    row: {
      flexDirection: 'row',
      marginVertical: 2, // reduced from 3
    },
    label: {
      width: '30%',
      fontSize: 11,
      fontWeight: 'bold',
      color: '#555',
    },
    value: {
      width: '70%',
      fontSize: 11,
      color: '#333',
    },
    costSection: {
      marginVertical: 6, // reduced from 10
    },
    costRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 2, // reduced from 3
      borderBottom: '1 dotted #eaeaea',
    },
    costLabel: {
      fontSize: 11,
      color: '#555',
    },
    costValue: {
      fontSize: 11,
      color: '#333',
    },
    totalCost: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 6,
      paddingBottom: 4,
      borderTop: '1 solid #333',
      marginTop: 4,
      marginBottom: 6,
    },
    totalLabel: {
      fontSize: 13,
      fontWeight: 'bold',
      color: '#333',
    },
    totalValue: {
      fontSize: 13,
      fontWeight: 'bold',
      color: '#333',
    },
    notes: {
      marginVertical: 6,
      fontSize: 11,
      color: '#333',
      padding: 8,
      backgroundColor: '#f9f9f9',
      borderRadius: 5,
    },
    signature: {
      marginTop: 20, // reduced from 30
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    signatureItem: {
      width: '45%',
      alignItems: 'center',
    },
    signatureLine: {
      borderBottom: '1 solid #333',
      width: '100%',
      marginBottom: 4,
    },
    signatureLabel: {
      fontSize: 9,
      color: '#555',
      textAlign: 'center',
    },
    signatureImage: {
      width: 90,
      height: 45,
      marginBottom: 4,
      objectFit: 'contain',
    },
    footer: {
      position: 'absolute',
      bottom: 20, // reduced from 30
      left: 20,
      right: 20,
      textAlign: 'center',
      fontSize: 9,
      color: '#777',
      borderTop: '1 solid #eaeaea',
      paddingTop: 6, // reduced
    },
    pageNumber: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      fontSize: 9,
      color: '#777',
    },
  });
  
  interface ComplaintData {
    title: string;
    location: string;
    createdAt: string;
    supervisor:{
      id: string;
      email: string;
      phone: string;
      username: string;
    },
    inspectionDate: string;
    completionDate: string;
  }
  
  interface ReportData {
      id: string;
      createdAt: string;
      updatedAt: string;
      totalDaysInvested: number;
      totalWorkers: number;
      costBreakdown: {
          labor: number;
          materials: number;
          equipment: number;
          miscellaneous: number;
      };
      totalCost: number;
      notes: string;
  }

interface ReportPDFProps {
  report: ReportData;
  complaint: ComplaintData;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const formatCurrency = (amount: number) => {
  return `₹${amount}`;
};

const ReportPDF = ({ report, complaint }: ReportPDFProps) => {
  return (
    <PDFViewer style={{ width: '100%', height: '100vh' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.title}>Construction Report</Text>
                <Text style={styles.reportId}>Report ID: {report.id}</Text>
                <Text style={{ fontSize: 12, color: '#555' }}>Generated on: {new Date().toLocaleDateString()}</Text>
              </View>
              {/* You can add your organization logo here */}
              {/* <Image style={styles.logo} src="/logo.png" /> */}
            </View>
          </View>

          {/* Complaint Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Complaint Information</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Title:</Text>
              <Text style={styles.value}>{complaint.title}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Location:</Text>
              <Text style={styles.value}>{complaint.location}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Submitted On:</Text>
              <Text style={styles.value}>{formatDate(complaint.createdAt)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Inspected On:</Text>
              <Text style={styles.value}>{formatDate(complaint.inspectionDate)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Completed On:</Text>
              <Text style={styles.value}>{formatDate(complaint.completionDate)}</Text>
            </View>
          </View>

          {/* Supervisor Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Supervisor Information</Text>
            <View style={styles.row}>
              <Text style={styles.label}>ID:</Text>
              <Text style={styles.value}>{complaint.supervisor.id}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{complaint.supervisor.username}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Contact:</Text>
              <Text style={styles.value}>{complaint.supervisor.email} | {complaint.supervisor.phone}</Text>
            </View>
          </View>

          {/* Resource Allocation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resource Allocation</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Total Days Invested:</Text>
              <Text style={styles.value}>{report.totalDaysInvested} days</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Total Workers:</Text>
              <Text style={styles.value}>{report.totalWorkers} workers</Text>
            </View>
          </View>

          {/* Cost Breakdown */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cost Breakdown</Text>
            <View style={styles.costSection}>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Materials</Text>
                <Text style={styles.costValue}>{formatCurrency(report.costBreakdown.materials)}</Text>
              </View>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Labor</Text>
                <Text style={styles.costValue}>{formatCurrency(report.costBreakdown.labor)}</Text>
              </View>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Equipment</Text>
                <Text style={styles.costValue}>{formatCurrency(report.costBreakdown.equipment)}</Text>
              </View>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Miscellaneous</Text>
                <Text style={styles.costValue}>{formatCurrency(report.costBreakdown.miscellaneous)}</Text>
              </View>
              <View style={styles.totalCost}>
                <Text style={styles.totalLabel}>Total Cost</Text>
                <Text style={styles.totalValue}>{formatCurrency(report.totalCost)}</Text>
              </View>
            </View>
          </View>

          {/* Additional Notes */}
          {report.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Notes</Text>
              <Text style={styles.notes}>{report.notes}</Text>
            </View>
          )}

          {/* Signatures */}
          <View style={styles.signature}>
            <View style={styles.signatureItem}>
              <Text style={styles.label}>{complaint.supervisor.username}</Text>
              <Text style={styles.signatureLabel}>Supervisor Signature</Text>
            </View>
            <View style={styles.signatureItem}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Authority Signature</Text>
            </View>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            This is an official construction report generated by the Municipal Corporation Management System. 
            This document is valid without physical signature if accessed through the official portal.
          </Text>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `${pageNumber} / ${totalPages}`
          )} fixed />
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default ReportPDF;
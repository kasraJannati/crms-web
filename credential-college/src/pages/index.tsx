import * as React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import type { HeadFC, PageProps } from "gatsby";
import useAgentStore from "@/stores/useAgent.store";

const API_URL = import.meta.env.VITE_API_URL;
const AGENT = import.meta.env.VITE_AGENT_NAME;

const IndexPage: React.FC<Partial<PageProps>> = () => {
  const title = "Students";
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const agentInfo = useAgentStore.getState().agentInfo;

      // Only fetch students if agentInfo is available
      if (!agentInfo) return;

      try {
        const response = await fetch(
          `${API_URL}/v1.0/connections/agent/${AGENT}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data?.statusCode !== 500) {
          setStudents(data);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    // Set a timeout of 5 seconds before fetching
    const timeoutId = setTimeout(() => {
      fetchStudents();
    }, 1000);

    // Clean up the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <h1 className="bai-jamjuree-regular">{title}</h1>
        <StyledLink
          key="addStudent"
          to="/add-student"
          className="flex items-center text-white px-4 py-2 inter-regular-bold"
        >
          <span className="mr-2">Add Student</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.8571 6.28571H9.71429V1.14286C9.71429 0.511786 9.2025 0 8.57143 0H7.42857C6.7975 0 6.28571 0.511786 6.28571 1.14286V6.28571H1.14286C0.511786 6.28571 0 6.7975 0 7.42857V8.57143C0 9.2025 0.511786 9.71429 1.14286 9.71429H6.28571V14.8571C6.28571 15.4882 6.7975 16 7.42857 16H8.57143C9.2025 16 9.71429 15.4882 9.71429 14.8571V9.71429H14.8571C15.4882 9.71429 16 9.2025 16 8.57143V7.42857C16 6.7975 15.4882 6.28571 14.8571 6.28571Z"
              fill="white"
            />
          </svg>
        </StyledLink>
      </div>

      <TableContainer className="overflow-x-auto my-2">
        {students.length === 0 ? (
          <NoRecordsMessage>There are no records!</NoRecordsMessage>
        ) : (
          <table className="min-w-full text-left">
            <Thead className="inter-regular text-base">
              <tr>
                <th scope="col" className="px-6 py-4">
                  Student ID
                </th>
                <th scope="col" className="px-6 py-4">
                  Student Name
                </th>
                <th scope="col" className="px-6 py-4">
                  Status
                </th>
              </tr>
            </Thead>
            <Tbody className="inter-regular text-base">
              {students.map((student: any) => (
                <tr key={student?.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    {student?.metadata?.StudentRecord?.id ?? "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {student?.metadata?.StudentRecord?.student_name ?? "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {student?.state ?? "-"}
                  </td>
                </tr>
              ))}
            </Tbody>
          </table>
        )}
      </TableContainer>
    </PageContainer>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;

/* Styles */
const PageContainer = styled.div`
  h1 {
    font-size: 30px;
    color: #1b1b1b;
  }
`;
const StyledLink = styled(Link)`
  background: #ffa41d;
  border-radius: 4px;
  font-size: 16px;
`;
const TableContainer = styled.div`
  border: 1px solid #d3d3d3;
  border-radius: 4px;
  box-shadow: 0px 4px 4px 0px #1b1b1b1a;
  table {
    min-width: 400px;
    width: 100%;
  }
`;
const Thead = styled.thead`
  background: #f8f8f8;
`;
const Tbody = styled.tbody`
  tr:nth-child(even) {
    background: #f8f8f8;
  }
  tr:nth-child(odd) {
    background: #ffffff;
  }
`;
const NoRecordsMessage = styled.p`
  padding: 20px;
  font-size: 18px;
  color: #1b1b1b;
  text-align: center;
`;

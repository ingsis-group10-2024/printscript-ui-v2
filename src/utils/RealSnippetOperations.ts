import axios from 'axios';
import {SnippetOperations} from "./snippetOperations.ts";
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "./snippet.ts";
import {PaginatedUsers} from "./users.ts";
import {Rule} from "../types/Rule.ts";
import {TestCase} from "../types/TestCase.ts";
import {FileType} from "../types/FileType.ts";
import {ExecutionResponse, TestCaseResult} from "./queries.tsx";


export class RealSnippetOperations implements SnippetOperations {
    private readonly baseUrl: string;
    private readonly getAccessToken: () => Promise<string>;

    constructor(baseUrl: string, getAccessToken: () => Promise<string>) {
        this.baseUrl = baseUrl;
        this.getAccessToken = getAccessToken;
    }

    private async getHeaders() {
        const token = await this.getAccessToken();
        console.log(token)
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    }

    async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
        const response = await axios.post(`${this.baseUrl}/manager/snippet`, createSnippet, {
            headers: await this.getHeaders(),
        });
        return response.data;
    }

    async executeSnippet(content: string, languageVersion: string = "1.1"): Promise<ExecutionResponse> {
        const response = await axios.post(`${this.baseUrl}/runner/execute`, {
            content: content,
            languageVersion: languageVersion
        }, {
            headers: await this.getHeaders(),
        });

        return response.data;
    }

    async getSnippetById(id: string): Promise<Snippet | undefined> {
        const response = await axios.get(`${this.baseUrl}/manager/snippet/get`, {
            params: { snippetId: id },
            headers: await this.getHeaders(),
        });
        return response.data;
    }

    async listSnippetDescriptors(page: number = 0, pageSize: number = 1): Promise<PaginatedSnippets> {
        const response = await axios.get(`${this.baseUrl}/manager/snippet/snippets`, {
            params: { page, pageSize },
            headers: await this.getHeaders(),
        });
        return response.data;
    }

    async updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet> {
        const response = await axios.put(`${this.baseUrl}/manager/snippet/update/${id}`, updateSnippet, {
            headers: await this.getHeaders(),
        });
        return response.data;
    }

    async getUserFriends(name: string = "", page: number = 0, pageSize: number = 10): Promise<PaginatedUsers> {
        const response = await axios.get(`${this.baseUrl}/manager/users`, {
            params: { name, page, pageSize },
            headers: await this.getHeaders(),
        });
        return response.data;
    }

    async shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
        const response = await axios.post(`${this.baseUrl}/permission/snippets/share/${snippetId}`, {
                targetUserId: userId
            },
            {
                headers: await this.getHeaders(),
            });
        return response.data;
    }

    async getFormatRules(): Promise<Rule[]> {
        const response = await axios.get(`${this.baseUrl}/manager/rules/format`, {
            headers: await this.getHeaders(),
        });
        return response.data;
    }

    async getLintingRules(): Promise<Rule[]> {
        const response = await axios.get(`${this.baseUrl}/manager/rules/lint`, {
            headers: await this.getHeaders(),
        });
        return response.data;
    }

    async formatSnippet(snippetContent: string): Promise<string> {
        const response = await axios.post(`${this.baseUrl}/runner/format`, { content: snippetContent }, {
            headers: await this.getHeaders(),
        });
        console.log("API answer: ", response.data);
        // Check if the response has the expected format
        if (response.data && typeof response.data.formattedContent === 'string') {
            return response.data.formattedContent; // Return the formatted content
        } else {
            throw new Error('Response error: ' + JSON.stringify(response.data));
        }
    }

    async getTestCases(): Promise<TestCase[]> {
        const response = await axios.get(`${this.baseUrl}/manager/testcases`, {
            headers: await this.getHeaders(),
        });
        return response.data;
    }

    async postTestCase(testCase: TestCase): Promise<TestCase> {
        const response = await axios.post(`${this.baseUrl}/manager/testcases`, testCase, {
            headers: await this.getHeaders(),
        });
        return response.data;
    }

    async removeTestCase(id: string): Promise<string> {
        await axios.delete(`${this.baseUrl}/manager/testcases/${id}`, {
            headers: await this.getHeaders(),
        });
        return id;
    }

    async testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult> {
        const response = await axios.post(`${this.baseUrl}/manager/testcases/test`, testCase, {
            headers: await this.getHeaders(),
        });
        return response.data;
    }

    async deleteSnippet(id: string): Promise<string> {
        await axios.delete(`${this.baseUrl}/manager/snippet/${id}`, {
            headers: await this.getHeaders(),
        });
        return id;
    }

    async getFileTypes(): Promise<FileType[]> {
        const response = await axios.get(`${this.baseUrl}/permission/filetypes`, {
            headers: await this.getHeaders(),
        });
        return response.data;
    }

    async modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
        const response = await axios.put(`${this.baseUrl}/manager/rules/format`, newRules, {
            headers: await this.getHeaders(),
        });
        return response.data;
    }

    async modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
        const response = await axios.put(`${this.baseUrl}/manager/rules/lint`, newRules, {
            headers: await this.getHeaders(),
        });
        return response.data;
    }
}

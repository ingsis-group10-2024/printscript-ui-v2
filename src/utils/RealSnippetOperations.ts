import axios from 'axios';
import {SnippetOperations} from "./snippetOperations.ts";
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "./snippet.ts";
import {PaginatedUsers} from "./users.ts";
import {Rule} from "../types/Rule.ts";
import {TestCase} from "../types/TestCase.ts";
import {FileType} from "../types/FileType.ts";
import {TestCaseResult} from "./queries.tsx";


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
        const response = await axios.put(`${this.baseUrl}/manager/snippet/snippets/${id}`, updateSnippet, {
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
        const response = await axios.get(`${this.baseUrl}/permission/rules/format`, {
            headers: await this.getHeaders(),
        });
        return response.data;
    }

    async getLintingRules(): Promise<Rule[]> {
        const response = await axios.get(`${this.baseUrl}/permission/rules/lint`, {
            headers: await this.getHeaders(),
        });
        return response.data;
    }

    async formatSnippet(snippetContent: string): Promise<string> {
        const response = await axios.post(`${this.baseUrl}/runner/format`, { content: snippetContent }, {
            headers: await this.getHeaders(),
        });
        return response.data;
    }

    async getTestCases(): Promise<TestCase[]> {
        const response = await axios.get(`${this.baseUrl}/permission/testcases`, {
            headers: await this.getHeaders(),
        });
        return response.data;
    }

    async postTestCase(testCase: TestCase): Promise<TestCase> {
        const response = await axios.post(`${this.baseUrl}/permission/testcases`, testCase, {
            headers: await this.getHeaders(),
        });
        return response.data;
    }

    async removeTestCase(id: string): Promise<string> {
        await axios.delete(`${this.baseUrl}/permission/testcases/${id}`, {
            headers: await this.getHeaders(),
        });
        return id; // Devolvemos el ID como confirmación de eliminación.
    }

    async testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult> {
        const response = await axios.post(`${this.baseUrl}/permission/test`, testCase, {
            headers: await this.getHeaders(),
        });
        return response.data;
    }

    async deleteSnippet(id: string): Promise<string> {
        await axios.delete(`${this.baseUrl}/permission/snippets/${id}`, {
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
        const response = await axios.put(`${this.baseUrl}/permission/rules/format`, newRules, {
            headers: await this.getHeaders(),
        });
        return response.data;
    }

    async modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
        const response = await axios.put(`${this.baseUrl}/permission/rules/lint`, newRules, {
            headers: await this.getHeaders(),
        });
        return response.data;
    }
}

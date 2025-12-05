import React from 'react';
import type { Agent, Task, HistoryItem, Tool } from './types';
import { AgentStatus, TaskStatus, HistoryItemRole } from './types';

export const PlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
    </svg>
);

export const PauseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M5.75 4.75a.75.75 0 00-1.5 0v10.5a.75.75 0 001.5 0V4.75zM14.25 4.75a.75.75 0 00-1.5 0v10.5a.75.75 0 001.5 0V4.75z" />
    </svg>
);

export const StopIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M5.5 5.5A.5.5 0 005 6v8a.5.5 0 00.5.5h8a.5.5 0 00.5-.5V6a.5.5 0 00-.5-.5h-8z" />
    </svg>
);

export const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const ExclamationCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

export const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const HandRaisedIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
    </svg>
);

export const BeakerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" {...props}>
        <path d="M11.25 3v1.875c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3M11.25 3v-1.875a.375.375 0 01.375-.375h2.25c.207 0 .375.168.375.375V3m-3.75 0h3.75M12 15.75l-3.75-3.75M12 15.75l3.75-3.75M12 15.75V18m3.75-3.75H18a2.25 2.25 0 012.25 2.25v.625A2.25 2.25 0 0118 18h-3.75m-3.75 0H6a2.25 2.25 0 01-2.25-2.25v-.625A2.25 2.25 0 016 12h1.5" />
    </svg>
);

export const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

export const XMarkIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
  </svg>
);

export const CodeBracketIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 15" />
    </svg>
);

export const MagnifyingGlassIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.69-5.69m-2.6-4.31a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
    </svg>
);

export const BellAlertIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
    </svg>
);

export const ServerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z" />
    </svg>
);

export const TicketIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-1.5h5.25m-5.25 0h3m-3 0h-3m2.25-4.5h5.25m-5.25 0h3m-3 0h-3m2.25-4.5h5.25m-5.25 0h3m-3 0h-3M15 6.75l-3 3-3-3" />
    </svg>
);

export const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

export const ArrowPathIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-3.181-3.182l-3.182 3.182a8.25 8.25 0 01-11.664 0l-3.181-3.182m3.181 3.182L6 12m12.023 7.348l-3.182-3.182" />
    </svg>
);

export const DocumentArrowDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />
    </svg>
);

export const PaperAirplaneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M3.105 3.105a.75.75 0 01.814-.156l14.692 4.897a.75.75 0 010 1.308L3.919 17.05a.75.75 0 01-.814-.156l-.619-.62a.75.75 0 01.156-.814L6.95 12.522a.75.75 0 000-1.044L2.642 7.654a.75.75 0 01-.156-.814l.619-.62z" />
    </svg>
);

export const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

export const BotIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5l.415-.207a.75.75 0 011.085.67V10.5m0 0h6m-6 0a.75.75 0 001.085.67l.415-.207M8.25 10.5V6.67c0-.414.336-.75.75-.75h4.5a.75.75 0 01.75.75v3.83c0 .414-.336.75-.75.75h-4.5a.75.75 0 01-.75-.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5v.75A.75.75 0 009.75 15h4.5a.75.75 0 00.75-.75v-.75M9 13.5h6" />
    </svg>
);

export const Cog6ToothIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827c.48.398.668 1.03.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 01-.22.127c-.332.183-.582.495-.645.87l-.213 1.281c-.09.542-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.437-.995s-.145-.755-.437-.995l-1.004-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.075-.124.072-.044.146-.087.22-.127.332-.183.582-.495.645-.87l.213-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const TagIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
);

export const PencilIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

export const Squares2X2Icon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6A2.25 2.25 0 0115.75 3.75h2.25A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75A2.25 2.25 0 0115.75 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
);

export const CpuChipIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5m0 15v-1.5M12 8.25v-1.5m0 15V12A2.25 2.25 0 009.75 9.75h-4.5A2.25 2.25 0 003 12m0 0v.003A2.25 2.25 0 005.25 14.25h4.5A2.25 2.25 0 0012 12m0 0h.003A2.25 2.25 0 0114.25 9.75h4.5A2.25 2.25 0 0121 12m0 0v.003A2.25 2.25 0 0118.75 14.25h-4.5A2.25 2.25 0 0112 12m0 0h.003A2.25 2.25 0 0014.25 9.75h4.5A2.25 2.25 0 0021 12m-9 0h.003" />
    </svg>
);

const CheckCircleIconSolid = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.06 0l4-5.5z" clipRule="evenodd" />
    </svg>
);

const XCircleIconSolid = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
    </svg>
);

export const statusDisplayConfig: Record<AgentStatus, { label: string; badgeClasses: string; icon: React.ElementType }> = {
    [AgentStatus.IDLE]: {
        label: 'Idle',
        badgeClasses: 'bg-slate-700/80 text-slate-300 border-slate-600',
        icon: PauseIcon,
    },
    [AgentStatus.RUNNING]: {
        label: 'Running',
        badgeClasses: 'bg-green-500/20 text-green-300 border-green-500/40 animate-pulse',
        icon: PlayIcon,
    },
    [AgentStatus.PAUSED]: {
        label: 'Paused',
        badgeClasses: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
        icon: PauseIcon,
    },
    [AgentStatus.FINISHED]: {
        label: 'Finished',
        badgeClasses: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
        icon: CheckCircleIconSolid,
    },
    [AgentStatus.ERROR]: {
        label: 'Error',
        badgeClasses: 'bg-red-500/20 text-red-300 border-red-500/40',
        icon: XCircleIconSolid,
    },
    [AgentStatus.REPLANNING]: {
        label: 'Replanning',
        badgeClasses: 'bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse',
        icon: ArrowPathIcon,
    },
};

export const toolLibrary: Tool[] = [
  { 
    name: 'KubernetesAPI', 
    description: 'Interact with Kubernetes clusters to manage pods, services, and deployments.', 
    icon: ServerIcon, 
    enabled: true,
    configurationFields: [
        { name: 'kubeconfig', label: 'Kubeconfig (Base64)', type: 'password', placeholder: 'Paste your base64 encoded kubeconfig file' },
        { name: 'context', label: 'Cluster Context', type: 'text', placeholder: 'e.g., gke_my-project_us-central1_prod-cluster' },
    ]
  },
  { 
    name: 'PagerDutyAPI', 
    description: 'Trigger and manage incidents and escalations for on-call teams.', 
    icon: BellAlertIcon, 
    enabled: true,
    configurationFields: [
        { name: 'apiKey', label: 'API Key', type: 'password', placeholder: 'Enter your PagerDuty API Key' },
    ]
  },
  { 
    name: 'SlackAPI', 
    description: 'Send messages, upload files, and interact with Slack channels.', 
    icon: BotIcon, 
    enabled: true,
    configurationFields: [
        { name: 'botToken', label: 'Bot User OAuth Token', type: 'password', placeholder: 'xoxb-...' },
    ]
  },
  { 
    name: 'AWS_S3', 
    description: 'Manage files and objects in Amazon S3 storage buckets.', 
    icon: ServerIcon, 
    enabled: true,
    configurationFields: [
        { name: 'accessKeyId', label: 'AWS Access Key ID', type: 'text', placeholder: 'Your AWS Access Key ID' },
        { name: 'secretAccessKey', label: 'AWS Secret Access Key', type: 'password', placeholder: 'Your AWS Secret Access Key' },
        { name: 'region', label: 'AWS Region', type: 'text', placeholder: 'e.g., us-east-1' },
    ]
  },
  { 
    name: 'JiraAPI', 
    description: 'Create and manage issues, tickets, and projects in Jira.', 
    icon: TicketIcon, 
    enabled: true,
    configurationFields: [
        { name: 'serverUrl', label: 'Jira Server URL', type: 'text', placeholder: 'https://your-domain.atlassian.net' },
        { name: 'email', label: 'User Email', type: 'text', placeholder: 'Your email associated with Jira' },
        { name: 'apiToken', label: 'API Token', type: 'password', placeholder: 'Your Jira API Token' },
    ]
  },
  { 
    name: 'GitHubAPI', 
    description: 'Interact with GitHub repositories, pull requests, and issues.', 
    icon: CodeBracketIcon, 
    enabled: true,
    configurationFields: [
        { name: 'personalAccessToken', label: 'Personal Access Token', type: 'password', placeholder: 'Your GitHub PAT' },
    ]
  },
  { 
    name: 'GoogleSearch', 
    description: 'Perform web searches to gather public information and context.', 
    icon: MagnifyingGlassIcon, 
    enabled: true,
    configurationFields: [
        { name: 'apiKey', label: 'Google Search API Key', type: 'password', placeholder: 'Your Google Cloud API Key' },
        { name: 'searchEngineId', label: 'Search Engine ID (CX)', type: 'text', placeholder: 'Your Programmable Search Engine ID' },
    ]
  },
  { 
    name: 'CodeInterpreter', 
    description: 'Execute sandboxed code (e.g., Python) for data analysis and complex logic.', 
    icon: CodeBracketIcon, 
    enabled: true,
    configurationFields: [] // This would be configured on the backend (e.g., Docker environment)
  },
  {
    name: 'DatabaseAPI',
    description: 'Connect to and query SQL databases to retrieve structured data.',
    icon: ServerIcon,
    enabled: true,
    configurationFields: [
        { name: 'connectionString', label: 'Database Connection URI', type: 'password', placeholder: 'postgresql://user:password@host:port/dbname' },
    ]
  },
  { 
    name: 'GenericAPI', 
    description: 'A flexible connector for interacting with any RESTful API endpoint.', 
    icon: CodeBracketIcon, 
    enabled: true,
    configurationFields: [
        { name: 'baseUrl', label: 'Base URL', type: 'text', placeholder: 'https://api.example.com/v1' },
        { name: 'apiKey', label: 'API Key (optional)', type: 'password', placeholder: 'Optional API Key for auth header' },
    ]
  },
  {
    name: 'SalesforceAPI',
    description: 'Interact with Salesforce to manage leads, contacts, and other CRM data.',
    icon: TicketIcon,
    enabled: true,
    configurationFields: [
        { name: 'instanceUrl', label: 'Salesforce Instance URL', type: 'text', placeholder: 'https://your-domain.my.salesforce.com' },
        { name: 'clientId', label: 'Client ID', type: 'text', placeholder: 'Your connected app client ID' },
        { name: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'Your connected app client secret' },
    ]
  },
];

export const agentTemplates = [
  {
    name: 'SRE Incident Responder',
    goal: 'Monitor production Kubernetes cluster for unusual pod crash loops. If found, query pod status, escalate to on-call via PagerDuty, and post a summary to Slack.',
  },
  {
    name: 'Security Analyst',
    goal: 'Scan a public S3 bucket for accidental PII exposure. If found, quarantine the file, notify the security team in Jira, and log the incident.',
  },
  {
    name: 'Code Review Assistant',
    goal: 'Analyze a new pull request on GitHub. Run linting checks using CodeInterpreter, and post a summary of the results as a comment on the PR.',
  }
];

const sampleHistory1: HistoryItem[] = [
  { id: 'h1', timestamp: new Date().toISOString(), role: HistoryItemRole.SYSTEM, content: 'Agent initiated.' },
];

const sampleTasks1: Task[] = [
  { id: 't1', name: 'Connect to Prod Cluster', description: 'Authenticate with the production Kubernetes cluster using service account credentials.', tool: 'KubernetesAPI', status: TaskStatus.PENDING, requiresApproval: false, history: [] },
  { id: 't2', name: 'Query Pod Status', description: 'Execute `kubectl get pods -n production` and filter for pods with high restart counts (> 5).', tool: 'KubernetesAPI', status: TaskStatus.PENDING, requiresApproval: false, history: [] },
  { id: 't3', name: 'Escalate to On-Call', description: 'If crashing pods are found, page the on-call engineer via PagerDuty.', tool: 'PagerDutyAPI', status: TaskStatus.PENDING, requiresApproval: true, history: [] },
  { id: 't4', name: 'Post to Slack', description: 'Post a summary of findings to the #ops-alerts Slack channel.', tool: 'SlackAPI', status: TaskStatus.PENDING, requiresApproval: false, history: [] },
];

const sampleAgent1: Agent = {
  id: 'agent-1',
  name: 'K8s Pod Monitor',
  goal: 'Monitor production Kubernetes cluster for unusual pod crash loops and post a summary to Slack.',
  status: AgentStatus.IDLE,
  tasks: sampleTasks1,
  history: sampleHistory1,
  createdAt: new Date(Date.now() - 86400000).toISOString(),
  tags: ['production', 'sre', 'monitoring'],
};


const sampleTasks2: Task[] = [
  { id: 't5', name: 'Scan S3 Bucket', description: 'Scan `s3://customer-uploads` for new files.', tool: 'AWS_S3', status: TaskStatus.COMPLETED, requiresApproval: false, history: [] },
  { id: 't6', name: 'Analyze File Content', description: 'Use NLP model to classify the content of new files.', tool: 'GenericAPI', status: TaskStatus.COMPLETED, requiresApproval: false, history: [] },
  { id: 't7', name: 'Update CRM Record', description: 'Update the corresponding customer record in Salesforce with the analysis summary.', tool: 'SalesforceAPI', status: TaskStatus.AWAITING_APPROVAL, requiresApproval: true, history: [] },
  { id: 't8', name: 'Archive File', description: 'Move the processed file to `s3://customer-uploads-archive`.', tool: 'AWS_S3', status: TaskStatus.PENDING, requiresApproval: false, history: [] },
];

const sampleHistory2: HistoryItem[] = [
  { id: 'h2-1', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), role: HistoryItemRole.SYSTEM, content: 'Agent initiated.' },
  { id: 'h2-2', timestamp: new Date(Date.now() - 3600000).toISOString(), role: HistoryItemRole.USER, content: 'Can you start processing the files from yesterday?' },
  { id: 'h2-3', timestamp: new Date(Date.now() - 3500000).toISOString(), role: HistoryItemRole.AGENT, content: 'Yes, I am beginning the process now.' },
];

const sampleAgent2: Agent = {
  id: 'agent-2',
  name: 'Customer Upload Processor',
  goal: 'Process new customer file uploads, analyze their content, update CRM, and archive.',
  status: AgentStatus.RUNNING,
  tasks: sampleTasks2,
  history: sampleHistory2,
  createdAt: new Date(Date.now() - 172800000).toISOString(),
  tags: ['data-processing', 'aws', 'automation'],
};

export const sampleAgents: Agent[] = [sampleAgent1, sampleAgent2];
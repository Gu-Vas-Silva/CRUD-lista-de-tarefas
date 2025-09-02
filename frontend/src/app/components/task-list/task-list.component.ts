import { Component, OnInit } from '@angular/core';
import { Tarefa } from '../../models/tarefa';
import { TarefaService } from '../../services/tarefa.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  tarefas: Tarefa[] = [];
  novaTarefa: { descricao: string; concluida: boolean } = { descricao: '', concluida: false };
  tarefaEmEdicao: Tarefa | null = null;
  
  constructor(private tarefaService: TarefaService) {}
  
  ngOnInit(): void {
    this.carregarTarefas();
  }

  carregarTarefas(): void {
    this.tarefaService.getTarefas().subscribe(data => this.tarefas = data);
  }

  adicionarTarefa(): void {
    if (!this.novaTarefa.descricao.trim()) return;
    this.tarefaService.addTarefa(this.novaTarefa).subscribe(tarefa => {
      this.tarefas.push(tarefa);
      this.novaTarefa = { descricao: '', concluida: false };
    });
  }
  
  deletarTarefa(id?: number): void {
    if (id === undefined) return;
    this.tarefaService.deleteTarefa(id).subscribe(() => {
      this.tarefas = this.tarefas.filter(t => t.id !== id);
    });
  }

  iniciarEdicao(tarefa: Tarefa): void {
    // Cria uma cópia para não alterar o original antes de salvar
    this.tarefaEmEdicao = { ...tarefa };
  }

  cancelarEdicao(): void {
    this.tarefaEmEdicao = null;
  }

  salvarEdicao(): void {
    if (this.tarefaEmEdicao) {
      this.tarefaService.updateTarefa(this.tarefaEmEdicao).subscribe(tarefaAtualizada => {
        const index = this.tarefas.findIndex(t => t.id === tarefaAtualizada.id);
        if (index !== -1) {
          this.tarefas[index] = tarefaAtualizada;
        }
        this.tarefaEmEdicao = null; // Sai do modo de edição
      });
    }
  }

  atualizarTarefa(tarefa: Tarefa): void {
      this.tarefaService.updateTarefa(tarefa).subscribe();
  }
  alternarTema(): void {
    document.body.classList.toggle('dark-mode');
  }
}

# Informe técnico — Proyecto MS Alert (completo)

**Documento Word:** [Informe-Proyecto-MS-Alertas.docx](./Informe-Proyecto-MS-Alertas.docx)

> El informe anterior solo cubría Swagger. Este documento describe **todo el microservicio**.

## Resumen

Microservicio NestJS para gestión de **eventos**, **alertas**, **reglas**, **severidades**, **canales de notificación**, **sistemas cliente**, **tokens** e integración con **n8n** + **PostgreSQL**.

## Métricas

| Indicador | Valor |
|-----------|-------|
| Archivos TypeScript | ~125 |
| Líneas de código | ~4.300 |
| Controladores | 9 |
| Entidades / tablas | 9 |
| Módulos de negocio | 8 + pruebas n8n |

## Estimación total de desarrollo (desde cero)

| Escenario | Horas | Días hábiles (8 h) |
|-----------|-------|---------------------|
| Mínimo (sin tests formales) | 187–328 | ~23–41 |
| Con tests básicos | 211–376 | ~26–47 |
| **Media recomendada** | **~264** | **~33** |

Swagger representa ~23–40 h dentro del total (ítem 16 del informe Word).

## Estructura del informe Word

1. Resumen ejecutivo  
2. Objetivo y dominio de negocio  
3. Arquitectura (capas y patrones)  
4. Stack tecnológico  
5. Modelo de datos  
6. Módulos y API REST  
7. Integraciones (PostgreSQL, n8n, seeds)  
8. Métricas de código  
9. Resumen Swagger  
10. Estimación detallada por actividad  
11. Pendientes / riesgos  
12. Conclusión  
